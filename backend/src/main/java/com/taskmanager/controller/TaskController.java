package com.taskmanager.controller;

import com.taskmanager.dto.task.TaskRequest;
import com.taskmanager.dto.task.TaskResponse;
import com.taskmanager.dto.task.TaskStatusUpdate;
import com.taskmanager.model.User;
import com.taskmanager.service.TaskService;
import com.taskmanager.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final AuthUtils authUtils;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(@PathVariable Long projectId,
                                                   @Valid @RequestBody TaskRequest request) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(projectId, request, user));
    }

    @GetMapping("/tasks")
    public ResponseEntity<com.taskmanager.dto.common.PageResponse<TaskResponse>> getTasks(
            @ModelAttribute com.taskmanager.dto.task.TaskFilterRequest filters,
            @org.springframework.data.web.PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) org.springframework.data.domain.Pageable pageable) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(taskService.getTasksFiltered(filters, pageable, user));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable Long projectId) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(taskService.getTasksByProject(projectId, user));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long taskId) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(taskService.getTaskById(taskId, user));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long taskId,
                                                   @Valid @RequestBody TaskRequest request) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(taskService.updateTask(taskId, request, user));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long taskId,
                                                     @Valid @RequestBody TaskStatusUpdate update) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(taskService.updateStatus(taskId, update, user));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        User user = authUtils.getCurrentUser();
        taskService.deleteTask(taskId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<com.taskmanager.dto.task.CommentResponse> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody com.taskmanager.dto.task.CommentRequest request) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.addComment(taskId, request, user));
    }
}
