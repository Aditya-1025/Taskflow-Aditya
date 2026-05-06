package com.taskmanager.service;

import com.taskmanager.dto.task.TaskRequest;
import com.taskmanager.dto.task.TaskResponse;
import com.taskmanager.dto.task.TaskStatusUpdate;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;
    private final ActivityLogService activityLogService;
    private final com.taskmanager.repository.CommentRepository commentRepository;
    public TaskResponse createTask(Long projectId, TaskRequest request, User creator) {
        Project project = projectService.findAndValidateAccess(projectId, creator);

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .project(project)
                .assignee(assignee)
                .creator(creator)
                .build();

        Task saved = taskRepository.save(task);
        activityLogService.log("TASK_CREATED", "Task '" + saved.getTitle() + "' created in project " + project.getName(), creator, project.getId(), saved.getId());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public com.taskmanager.dto.common.PageResponse<TaskResponse> getTasksFiltered(com.taskmanager.dto.task.TaskFilterRequest filters, org.springframework.data.domain.Pageable pageable, User user) {
        org.springframework.data.jpa.domain.Specification<Task> spec = org.springframework.data.jpa.domain.Specification.where(null);

        if (filters.getProjectId() != null) {
            projectService.findAndValidateAccess(filters.getProjectId(), user);
            spec = spec.and(com.taskmanager.repository.specification.TaskSpecification.hasProject(filters.getProjectId()));
        } else {
            // If no project specified, user can only see tasks in projects they have access to
            List<Project> accessibleProjects = projectService.getAllAccessibleProjects(user);
            if (accessibleProjects.isEmpty()) {
                return com.taskmanager.dto.common.PageResponse.<TaskResponse>builder()
                        .content(List.of())
                        .pageNumber(pageable.getPageNumber())
                        .pageSize(pageable.getPageSize())
                        .totalElements(0)
                        .totalPages(0)
                        .last(true)
                        .build();
            }
            spec = spec.and((root, query, cb) -> root.get("project").in(accessibleProjects));
        }

        spec = spec.and(com.taskmanager.repository.specification.TaskSpecification.hasStatus(filters.getStatus()))
                   .and(com.taskmanager.repository.specification.TaskSpecification.hasPriority(filters.getPriority()))
                   .and(com.taskmanager.repository.specification.TaskSpecification.hasAssignee(filters.getAssigneeId()))
                   .and(com.taskmanager.repository.specification.TaskSpecification.dueBefore(filters.getDueBefore()))
                   .and(com.taskmanager.repository.specification.TaskSpecification.dueAfter(filters.getDueAfter()));

        org.springframework.data.domain.Page<Task> page = taskRepository.findAll(spec, pageable);

        return com.taskmanager.dto.common.PageResponse.<TaskResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId, User user) {
        Project project = projectService.findAndValidateAccess(projectId, user);
        return taskRepository.findByProject(project).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, User user) {
        Task task = findTask(taskId);
        projectService.findAndValidateAccess(task.getProject().getId(), user);
        return mapToResponse(task);
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request, User user) {
        Task task = findTask(taskId);
        projectService.findAndValidateAccess(task.getProject().getId(), user);
        requireTaskEditPermission(task, user);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateStatus(Long taskId, TaskStatusUpdate update, User user) {
        Task task = findTask(taskId);
        projectService.findAndValidateAccess(task.getProject().getId(), user);

        // Assignee OR project admin can update status
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(user.getId());
        boolean isCreator = task.getCreator().getId().equals(user.getId());
        boolean isProjectAdmin = projectService.hasProjectAdminRole(task.getProject(), user);

        if (!isAssignee && !isCreator && !isProjectAdmin) {
            throw new UnauthorizedException("Only the assignee or project admin can update task status");
        }

        task.setStatus(update.getStatus());
        Task saved = taskRepository.save(task);

        activityLogService.log("STATUS_CHANGED", "Task status changed to " + update.getStatus(), user, task.getProject().getId(), task.getId());

        return mapToResponse(saved);
    }

    public void deleteTask(Long taskId, User user) {
        Task task = findTask(taskId);
        projectService.findAndValidateAccess(task.getProject().getId(), user);
        requireTaskDeletePermission(task, user);
        activityLogService.log("TASK_DELETED", "Task '" + task.getTitle() + "' deleted", user, task.getProject().getId(), task.getId());
        taskRepository.delete(task);
    }

    public com.taskmanager.dto.task.CommentResponse addComment(Long taskId, com.taskmanager.dto.task.CommentRequest request, User user) {
        Task task = findTask(taskId);
        projectService.findAndValidateAccess(task.getProject().getId(), user);

        com.taskmanager.model.Comment comment = com.taskmanager.model.Comment.builder()
                .content(request.getContent())
                .task(task)
                .user(user)
                .build();

        comment = commentRepository.save(comment);

        activityLogService.log("COMMENT_ADDED", "New comment added to task", user, task.getProject().getId(), task.getId());

        return mapToCommentResponse(comment);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private Task findTask(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
    }

    private void requireTaskDeletePermission(Task task, User user) {
        projectService.requireProjectAdmin(task.getProject(), user);
    }

    private void requireTaskEditPermission(Task task, User user) {
        boolean isCreator = task.getCreator().getId().equals(user.getId());
        boolean isProjectAdmin = projectService.hasProjectAdminRole(task.getProject(), user);
        if (!isCreator && !isProjectAdmin) {
            throw new UnauthorizedException("Only the task creator or project admin can edit this task");
        }
    }

    public TaskResponse mapToResponse(Task task) {
        boolean overdue = task.getDueDate() != null
                && task.getDueDate().isBefore(LocalDate.now())
                && task.getStatus() != Task.Status.DONE;

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .overdue(overdue)
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getName() : null)
                .assigneeEmail(task.getAssignee() != null ? task.getAssignee().getEmail() : null)
                .creatorId(task.getCreator().getId())
                .creatorName(task.getCreator().getName())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .comments(task.getComments() != null ? task.getComments().stream().map(this::mapToCommentResponse).collect(Collectors.toList()) : List.of())
                .build();
    }

    private com.taskmanager.dto.task.CommentResponse mapToCommentResponse(com.taskmanager.model.Comment comment) {
        return com.taskmanager.dto.task.CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
