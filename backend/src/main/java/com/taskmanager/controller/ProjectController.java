package com.taskmanager.controller;

import com.taskmanager.dto.project.AddMemberRequest;
import com.taskmanager.dto.project.MemberResponse;
import com.taskmanager.dto.project.ProjectRequest;
import com.taskmanager.dto.project.ProjectResponse;
import com.taskmanager.model.User;
import com.taskmanager.service.ProjectService;
import com.taskmanager.util.AuthUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthUtils authUtils;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest request) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request, user));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(projectService.getAllProjects(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(projectService.getProjectById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id,
                                                         @Valid @RequestBody ProjectRequest request) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(projectService.updateProject(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        User user = authUtils.getCurrentUser();
        projectService.deleteProject(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<MemberResponse>> getMembers(@PathVariable Long id) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.ok(projectService.getMembers(id, user));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<MemberResponse> addMember(@PathVariable Long id,
                                                     @Valid @RequestBody AddMemberRequest request) {
        User user = authUtils.getCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addMember(id, request, user));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long id, @PathVariable Long userId) {
        User user = authUtils.getCurrentUser();
        projectService.removeMember(id, userId, user);
        return ResponseEntity.noContent().build();
    }
}
