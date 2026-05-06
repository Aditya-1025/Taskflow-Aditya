package com.taskmanager.dto.task;

import com.taskmanager.model.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private Task.Priority priority;
    private LocalDate dueDate;
    private boolean overdue;

    private Long projectId;
    private String projectName;

    private Long assigneeId;
    private String assigneeName;
    private String assigneeEmail;

    private Long creatorId;
    private String creatorName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private java.util.List<CommentResponse> comments;
}
