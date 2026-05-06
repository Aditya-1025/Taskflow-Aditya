package com.taskmanager.dto.project;

import com.taskmanager.model.ProjectMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MemberResponse {
    private Long id;
    private String name;
    private String email;
    private ProjectMember.ProjectRole role;
}
