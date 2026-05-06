package com.taskmanager.repository;

import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignee(User user);

    List<Task> findByCreator(User user);

    long countByProjectAndStatus(Project project, Task.Status status);

    @Query("SELECT t FROM Task t WHERE t.project IN :projects ORDER BY t.createdAt DESC")
    List<Task> findRecentTasksInProjects(@Param("projects") List<Project> projects,
                                         org.springframework.data.domain.Pageable pageable);
}
