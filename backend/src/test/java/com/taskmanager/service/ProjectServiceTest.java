package com.taskmanager.service;

import com.taskmanager.exception.UnauthorizedException;
import com.taskmanager.model.Project;
import com.taskmanager.model.ProjectMember;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void hasProjectAdminRoleAllowsOwnerProjectAdminAndPlatformAdmin() {
        User owner = User.builder().id(1L).role(User.Role.MEMBER).build();
        User projectAdmin = User.builder().id(2L).role(User.Role.MEMBER).build();
        User platformAdmin = User.builder().id(3L).role(User.Role.ADMIN).build();
        Project project = Project.builder().id(10L).owner(owner).build();

        when(projectMemberRepository.findByProjectAndUser(project, projectAdmin))
                .thenReturn(Optional.of(ProjectMember.builder()
                        .project(project)
                        .user(projectAdmin)
                        .role(ProjectMember.ProjectRole.ADMIN)
                        .build()));

        assertThat(projectService.hasProjectAdminRole(project, owner)).isTrue();
        assertThat(projectService.hasProjectAdminRole(project, projectAdmin)).isTrue();
        assertThat(projectService.hasProjectAdminRole(project, platformAdmin)).isTrue();
    }

    @Test
    void requireProjectAdminRejectsPlainMembers() {
        User owner = User.builder().id(1L).role(User.Role.MEMBER).build();
        User member = User.builder().id(2L).role(User.Role.MEMBER).build();
        Project project = Project.builder().id(10L).owner(owner).build();

        when(projectMemberRepository.findByProjectAndUser(project, member))
                .thenReturn(Optional.of(ProjectMember.builder()
                        .project(project)
                        .user(member)
                        .role(ProjectMember.ProjectRole.MEMBER)
                        .build()));

        assertThatThrownBy(() -> projectService.requireProjectAdmin(project, member))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("Only project admins can perform this action");
    }
}
