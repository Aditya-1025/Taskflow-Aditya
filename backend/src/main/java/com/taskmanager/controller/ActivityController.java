package com.taskmanager.controller;

import com.taskmanager.dto.common.PageResponse;
import com.taskmanager.model.ActivityLog;
import com.taskmanager.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogService activityLogService;

    @GetMapping
    public ResponseEntity<PageResponse<ActivityLog>> getLogs(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ActivityLog> logsPage = activityLogService.getLogs(projectId, taskId, pageable);
        
        return ResponseEntity.ok(PageResponse.<ActivityLog>builder()
                .content(logsPage.getContent())
                .pageNumber(logsPage.getNumber())
                .pageSize(logsPage.getSize())
                .totalElements(logsPage.getTotalElements())
                .totalPages(logsPage.getTotalPages())
                .last(logsPage.isLast())
                .build());
    }
}
