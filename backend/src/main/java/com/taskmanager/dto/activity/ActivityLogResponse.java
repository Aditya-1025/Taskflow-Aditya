package com.taskmanager.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {
    private Long id;
    private String action;
    private String description;
    private Long userId;
    private String userName;
    private Long projectId;
    private Long taskId;
    private LocalDateTime createdAt;
}
