package com.taskmanager.dto.task;

import com.taskmanager.model.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private Task.Status status = Task.Status.TODO;

    @NotNull(message = "Priority is required")
    private Task.Priority priority = Task.Priority.MEDIUM;

    private LocalDate dueDate;

    private Long assigneeId;
}
