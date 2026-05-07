package com.taskmanager.service;

import com.taskmanager.dto.dashboard.DashboardStats;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public DashboardStats getDashboardStats(User user) {
        boolean admin = user.getRole() == User.Role.ADMIN;
        LocalDate today = LocalDate.now();

        long totalProjects = projectRepository.countAccessibleByUser(user, admin);
        long totalTasks = taskRepository.countAccessibleByUser(user, admin);
        long todoCount = taskRepository.countAccessibleByUserAndStatus(user, admin, Task.Status.TODO);
        long inProgressCount = taskRepository.countAccessibleByUserAndStatus(user, admin, Task.Status.IN_PROGRESS);
        long doneCount = taskRepository.countAccessibleByUserAndStatus(user, admin, Task.Status.DONE);
        long overdueCount = taskRepository.countAccessibleOverdueByUser(user, admin, today, Task.Status.DONE);
        long lowCount = taskRepository.countAccessibleByUserAndPriority(user, admin, Task.Priority.LOW);
        long mediumCount = taskRepository.countAccessibleByUserAndPriority(user, admin, Task.Priority.MEDIUM);
        long highCount = taskRepository.countAccessibleByUserAndPriority(user, admin, Task.Priority.HIGH);
        long criticalCount = taskRepository.countAccessibleByUserAndPriority(user, admin, Task.Priority.CRITICAL);

        return DashboardStats.builder()
                .totalProjects((int) totalProjects)
                .totalTasks((int) totalTasks)
                .todoCount((int) todoCount)
                .inProgressCount((int) inProgressCount)
                .doneCount((int) doneCount)
                .overdueCount((int) overdueCount)
                .lowPriorityCount((int) lowCount)
                .mediumPriorityCount((int) mediumCount)
                .highPriorityCount((int) highCount)
                .criticalPriorityCount((int) criticalCount)
                .recentTasks(List.of())
                .myTasks(List.of())
                .build();
    }
}
