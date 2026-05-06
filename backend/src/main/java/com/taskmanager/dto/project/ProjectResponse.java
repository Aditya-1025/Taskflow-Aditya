package com.taskmanager.dto.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerName;
    private String currentUserRole;
    private int memberCount;
    private int taskCount;
    private int todoCount;
    private int inProgressCount;
    private int doneCount;
    private LocalDateTime createdAt;
}
