package com.taskmanager.controller;

import com.taskmanager.dto.dashboard.DashboardStats;
import com.taskmanager.model.User;
import com.taskmanager.service.DashboardService;
import com.taskmanager.util.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthUtils authUtils;

    @GetMapping({"", "/stats"})
    public ResponseEntity<DashboardStats> getDashboard() {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(dashboardService.getDashboardStats(user));
    }
}
