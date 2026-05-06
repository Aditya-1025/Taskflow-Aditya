package com.taskmanager.service;

import com.taskmanager.model.ActivityLog;
import com.taskmanager.model.User;
import com.taskmanager.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
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
    public org.springframework.data.domain.Page<ActivityLog> getLogs(Long projectId, Long taskId, org.springframework.data.domain.Pageable pageable) {
        if (projectId != null && taskId != null) {
            return activityLogRepository.findByProjectIdAndTaskIdOrderByCreatedAtDesc(projectId, taskId, pageable);
        } else if (projectId != null) {
            return activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId, pageable);
        } else if (taskId != null) {
            return activityLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId, pageable);
        }
        return activityLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
