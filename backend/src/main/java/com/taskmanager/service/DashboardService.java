package com.taskmanager.service;

import com.taskmanager.dto.dashboard.DashboardStats;
import com.taskmanager.dto.task.TaskResponse;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TaskService taskService;

    public DashboardStats getDashboardStats(User user) {
        List<Project> userProjects = projectRepository.findAllAccessibleByUser(user);

        List<Task> allTasks = userProjects.stream()
                .flatMap(p -> taskRepository.findByProject(p).stream())
                .collect(Collectors.toList());

        LocalDate today = LocalDate.now();

        long todoCount = allTasks.stream()
                .filter(t -> t.getStatus() == Task.Status.TODO).count();
        long inProgressCount = allTasks.stream()
                .filter(t -> t.getStatus() == Task.Status.IN_PROGRESS).count();
        long doneCount = allTasks.stream()
                .filter(t -> t.getStatus() == Task.Status.DONE).count();
        long overdueCount = allTasks.stream()
                .filter(t -> t.getDueDate() != null
                        && t.getDueDate().isBefore(today)
                        && t.getStatus() != Task.Status.DONE)
                .count();

        long lowCount = allTasks.stream().filter(t -> t.getPriority() == Task.Priority.LOW).count();
        long mediumCount = allTasks.stream().filter(t -> t.getPriority() == Task.Priority.MEDIUM).count();
        long highCount = allTasks.stream().filter(t -> t.getPriority() == Task.Priority.HIGH).count();
        long criticalCount = allTasks.stream().filter(t -> t.getPriority() == Task.Priority.CRITICAL).count();

        List<TaskResponse> recentTasks = userProjects.isEmpty()
                ? List.of()
                : taskRepository.findRecentTasksInProjects(userProjects, PageRequest.of(0, 5))
                        .stream()
                        .map(taskService::mapToResponse)
                        .collect(Collectors.toList());

        List<TaskResponse> myTasks = taskRepository.findByAssignee(user).stream()
                .filter(t -> t.getStatus() != Task.Status.DONE)
                .map(taskService::mapToResponse)
                .collect(Collectors.toList());

        return DashboardStats.builder()
                .totalProjects(userProjects.size())
                .totalTasks(allTasks.size())
                .todoCount((int) todoCount)
                .inProgressCount((int) inProgressCount)
                .doneCount((int) doneCount)
                .overdueCount((int) overdueCount)
                .lowPriorityCount((int) lowCount)
                .mediumPriorityCount((int) mediumCount)
                .highPriorityCount((int) highCount)
                .criticalPriorityCount((int) criticalCount)
                .recentTasks(recentTasks)
                .myTasks(myTasks)
                .build();
    }
}
