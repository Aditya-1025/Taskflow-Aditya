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

    @Query("SELECT COUNT(t) FROM Task t WHERE :admin = true OR t.project.owner = :user OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = t.project AND m.user = :user)")
    long countAccessibleByUser(@Param("user") User user, @Param("admin") boolean admin);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status AND " +
           "(:admin = true OR t.project.owner = :user OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = t.project AND m.user = :user))")
    long countAccessibleByUserAndStatus(@Param("user") User user,
                                        @Param("admin") boolean admin,
                                        @Param("status") Task.Status status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.priority = :priority AND " +
           "(:admin = true OR t.project.owner = :user OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = t.project AND m.user = :user))")
    long countAccessibleByUserAndPriority(@Param("user") User user,
                                          @Param("admin") boolean admin,
                                          @Param("priority") Task.Priority priority);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status <> :doneStatus AND " +
           "(:admin = true OR t.project.owner = :user OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = t.project AND m.user = :user))")
    long countAccessibleOverdueByUser(@Param("user") User user,
                                      @Param("admin") boolean admin,
                                      @Param("today") LocalDate today,
                                      @Param("doneStatus") Task.Status doneStatus);
}
