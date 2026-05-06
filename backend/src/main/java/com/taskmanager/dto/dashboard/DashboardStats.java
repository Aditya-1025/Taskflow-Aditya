package com.taskmanager.dto.dashboard;

import com.taskmanager.dto.task.TaskResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStats {
    private int totalProjects;
    private int totalTasks;
    private int todoCount;
    private int inProgressCount;
    private int doneCount;
    private int overdueCount;
    
    private int lowPriorityCount;
    private int mediumPriorityCount;
    private int highPriorityCount;
    private int criticalPriorityCount;

    private List<TaskResponse> recentTasks;
    private List<TaskResponse> myTasks;
}
