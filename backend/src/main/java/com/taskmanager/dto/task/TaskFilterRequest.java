package com.taskmanager.dto.task;

import com.taskmanager.model.Task;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskFilterRequest {
    private Task.Status status;
    private Task.Priority priority;
    private Long assigneeId;
    private Long projectId;
    private LocalDate dueBefore;
    private LocalDate dueAfter;
}
