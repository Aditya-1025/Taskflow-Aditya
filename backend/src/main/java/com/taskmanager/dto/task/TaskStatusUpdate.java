package com.taskmanager.dto.task;

import com.taskmanager.model.Task;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskStatusUpdate {
    @NotNull(message = "Status is required")
    private Task.Status status;
}
