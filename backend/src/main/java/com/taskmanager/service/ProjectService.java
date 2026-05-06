package com.taskmanager.service;

import com.taskmanager.dto.project.AddMemberRequest;
import com.taskmanager.dto.project.MemberResponse;
import com.taskmanager.dto.project.ProjectRequest;
import com.taskmanager.dto.project.ProjectResponse;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.model.Project;
import com.taskmanager.model.ProjectMember;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public ProjectResponse createProject(ProjectRequest request, User owner) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();
        project = projectRepository.save(project);

        // Auto-add owner as project ADMIN
        ProjectMember ownerMember = ProjectMember.builder()
                .project(project)
                .user(owner)
                .role(ProjectMember.ProjectRole.ADMIN)
                .build();
        projectMemberRepository.save(ownerMember);

        activityLogService.log("PROJECT_CREATED", "Project '" + project.getName() + "' created", owner, project.getId(), null);

        return mapToResponse(project, owner);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(User user) {
        List<Project> projects = user.getRole() == User.Role.ADMIN
                ? projectRepository.findAll()
                : projectRepository.findAllAccessibleByUser(user);

        return projects
                .stream()
                .map(p -> mapToResponse(p, user))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Project> getAllAccessibleProjects(User user) {
        if (user.getRole() == User.Role.ADMIN) {
            return projectRepository.findAll();
        }
        return projectRepository.findAllAccessibleByUser(user);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, User user) {
        Project project = findAndValidateAccess(id, user);
        return mapToResponse(project, user);
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request, User user) {
        Project project = findAndValidateAccess(id, user);
        requireProjectAdmin(project, user);

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project updated = projectRepository.save(project);

        activityLogService.log("PROJECT_UPDATED", "Project details updated", user, id, null);

        return mapToResponse(updated, user);
    }

    public void deleteProject(Long id, User user) {
        Project project = findAndValidateAccess(id, user);
        // Only project owner can delete
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the project owner can delete this project");
        }
        activityLogService.log("PROJECT_DELETED", "Project '" + project.getName() + "' deleted", user, id, null);
        projectRepository.delete(project);
    }

    public MemberResponse addMember(Long projectId, AddMemberRequest request, User requester) {
        Project project = findAndValidateAccess(projectId, requester);
        requireProjectAdmin(project, requester);

        User newMember = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getEmail()));

        if (projectMemberRepository.existsByProjectAndUser(project, newMember)) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(newMember)
                .role(request.getRole())
                .build();
        projectMemberRepository.save(member);

        activityLogService.log("MEMBER_ADDED", "User '" + newMember.getName() + "' added as " + request.getRole(), requester, projectId, null);

        return MemberResponse.builder()
                .id(newMember.getId())
                .name(newMember.getName())
                .email(newMember.getEmail())
                .role(request.getRole())
                .build();
    }

    public void removeMember(Long projectId, Long userId, User requester) {
        Project project = findAndValidateAccess(projectId, requester);
        requireProjectAdmin(project, requester);

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (project.getOwner().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot remove the project owner");
        }

        projectMemberRepository.deleteByProjectAndUser(project, target);
        activityLogService.log("MEMBER_REMOVED", "User '" + target.getName() + "' removed from project", requester, projectId, null);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> getMembers(Long projectId, User user) {
        Project project = findAndValidateAccess(projectId, user);
        return projectMemberRepository.findByProject(project).stream()
                .map(m -> MemberResponse.builder()
                        .id(m.getUser().getId())
                        .name(m.getUser().getName())
                        .email(m.getUser().getEmail())
                        .role(m.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    public Project findAndValidateAccess(Long projectId, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        if (user.getRole() == User.Role.ADMIN) {
            return project;
        }

        boolean isOwner = project.getOwner().getId().equals(user.getId());
        boolean isMember = projectMemberRepository.existsByProjectAndUser(project, user);

        if (!isOwner && !isMember) {
            throw new UnauthorizedException("You don't have access to this project");
        }
        return project;
    }

    public void requireProjectAdmin(Project project, User user) {
        if (!hasProjectAdminRole(project, user)) {
            throw new UnauthorizedException("Only project admins can perform this action");
        }
    }

    public boolean hasProjectAdminRole(Project project, User user) {
        if (user.getRole() == User.Role.ADMIN) return true;
        if (project.getOwner().getId().equals(user.getId())) return true;

        Optional<ProjectMember> membership = projectMemberRepository.findByProjectAndUser(project, user);
        return membership.map(m -> m.getRole() == ProjectMember.ProjectRole.ADMIN).orElse(false);
    }

    private ProjectResponse mapToResponse(Project project, User currentUser) {
        List<Task> tasks = taskRepository.findByProject(project);

        Optional<ProjectMember> membership = projectMemberRepository.findByProjectAndUser(project, currentUser);
        String userRole;
        if (project.getOwner().getId().equals(currentUser.getId())) {
            userRole = "OWNER";
        } else if (currentUser.getRole() == User.Role.ADMIN) {
            userRole = "ADMIN";
        } else {
            userRole = membership.map(m -> m.getRole().name()).orElse("MEMBER");
        }

        long memberCount = projectMemberRepository.findByProject(project).size();

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerId(project.getOwner().getId())
                .ownerName(project.getOwner().getName())
                .currentUserRole(userRole)
                .memberCount((int) memberCount)
                .taskCount(tasks.size())
                .todoCount((int) tasks.stream().filter(t -> t.getStatus() == Task.Status.TODO).count())
                .inProgressCount((int) tasks.stream().filter(t -> t.getStatus() == Task.Status.IN_PROGRESS).count())
                .doneCount((int) tasks.stream().filter(t -> t.getStatus() == Task.Status.DONE).count())
                .createdAt(project.getCreatedAt())
                .build();
    }
}
