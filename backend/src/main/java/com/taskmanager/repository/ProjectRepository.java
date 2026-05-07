package com.taskmanager.repository;

import com.taskmanager.model.Project;
import com.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {

    List<Project> findByOwner(User owner);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.user = :user")
    List<Project> findByMember(@Param("user") User user);

    @Query("SELECT DISTINCT p FROM Project p WHERE p.owner = :user OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = p AND m.user = :user)")
    List<Project> findAllAccessibleByUser(@Param("user") User user);

    @Query("SELECT COUNT(DISTINCT p) FROM Project p WHERE :admin = true OR p.owner = :user OR EXISTS " +
           "(SELECT m FROM ProjectMember m WHERE m.project = p AND m.user = :user)")
    long countAccessibleByUser(@Param("user") User user, @Param("admin") boolean admin);
}
