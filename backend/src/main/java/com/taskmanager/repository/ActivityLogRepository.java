package com.taskmanager.repository;

import com.taskmanager.model.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    Page<ActivityLog> findByProjectIdOrderByCreatedAtDesc(Long projectId, Pageable pageable);
    Page<ActivityLog> findByTaskIdOrderByCreatedAtDesc(Long taskId, Pageable pageable);
    Page<ActivityLog> findByProjectIdAndTaskIdOrderByCreatedAtDesc(Long projectId, Long taskId, Pageable pageable);
    Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
