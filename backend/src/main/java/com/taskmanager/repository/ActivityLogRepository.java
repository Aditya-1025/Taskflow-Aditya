package com.taskmanager.repository;

import com.taskmanager.dto.activity.ActivityLogResponse;
import com.taskmanager.model.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    Page<ActivityLog> findByProjectIdOrderByCreatedAtDesc(Long projectId, Pageable pageable);
    Page<ActivityLog> findByTaskIdOrderByCreatedAtDesc(Long taskId, Pageable pageable);
    Page<ActivityLog> findByProjectIdAndTaskIdOrderByCreatedAtDesc(Long projectId, Long taskId, Pageable pageable);
    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT new com.taskmanager.dto.activity.ActivityLogResponse(" +
           "a.id, a.action, a.description, u.id, u.name, a.projectId, a.taskId, a.createdAt) " +
           "FROM ActivityLog a LEFT JOIN a.user u " +
           "WHERE (:projectId IS NULL OR a.projectId = :projectId) " +
           "AND (:taskId IS NULL OR a.taskId = :taskId) " +
           "ORDER BY a.createdAt DESC")
    Page<ActivityLogResponse> findResponses(@Param("projectId") Long projectId,
                                            @Param("taskId") Long taskId,
                                            Pageable pageable);
}
