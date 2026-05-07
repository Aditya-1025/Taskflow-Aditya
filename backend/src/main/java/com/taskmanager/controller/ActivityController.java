package com.taskmanager.controller;

import com.taskmanager.dto.activity.ActivityLogResponse;
import com.taskmanager.dto.common.PageResponse;
import com.taskmanager.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<PageResponse<ActivityLogResponse>> getLogs(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<ActivityLogResponse> logsPage = activityLogService.getLogs(projectId, taskId, pageable);
        
        return ResponseEntity.ok(logsPage);
    }
}
