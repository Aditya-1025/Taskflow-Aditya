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
        Page<ActivityLogResponse> logsPage = activityLogRepository.findResponses(projectId, taskId, pageable);

        return PageResponse.<ActivityLogResponse>builder()
                .content(logsPage.getContent())
                .pageNumber(logsPage.getNumber())
                .pageSize(logsPage.getSize())
                .totalElements(logsPage.getTotalElements())
                .totalPages(logsPage.getTotalPages())
                .last(logsPage.isLast())
                .build();
    }
}
