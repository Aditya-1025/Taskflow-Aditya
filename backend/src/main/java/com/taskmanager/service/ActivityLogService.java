package com.taskmanager.service;

import com.taskmanager.dto.activity.ActivityLogResponse;
import com.taskmanager.dto.common.PageResponse;
import com.taskmanager.model.ActivityLog;
import com.taskmanager.model.User;
import com.taskmanager.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public void log(String action, String description, User user, Long projectId, Long taskId) {
        ActivityLog log = ActivityLog.builder()
                .action(action)
                .description(description)
                .user(user)
                .projectId(projectId)
                .taskId(taskId)
                .build();
        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public PageResponse<ActivityLogResponse> getLogs(Long projectId, Long taskId, Pageable pageable) {
        Page<ActivityLog> logsPage;
        if (projectId != null && taskId != null) {
            logsPage = activityLogRepository.findByProjectIdAndTaskIdOrderByCreatedAtDesc(projectId, taskId, pageable);
        } else if (projectId != null) {
            logsPage = activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId, pageable);
        } else if (taskId != null) {
            logsPage = activityLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId, pageable);
        } else {
            logsPage = activityLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        return PageResponse.<ActivityLogResponse>builder()
                .content(logsPage.getContent().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .pageNumber(logsPage.getNumber())
                .pageSize(logsPage.getSize())
                .totalElements(logsPage.getTotalElements())
                .totalPages(logsPage.getTotalPages())
                .last(logsPage.isLast())
                .build();
    }

    private ActivityLogResponse mapToResponse(ActivityLog log) {
        User user = log.getUser();
        return ActivityLogResponse.builder()
                .id(log.getId())
                .action(log.getAction())
                .description(log.getDescription())
                .userId(user != null ? user.getId() : null)
                .userName(user != null ? user.getName() : "System")
                .projectId(log.getProjectId())
                .taskId(log.getTaskId())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
