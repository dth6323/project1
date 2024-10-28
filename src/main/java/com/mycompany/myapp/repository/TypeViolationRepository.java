package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TypeViolation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypeViolation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeViolationRepository extends JpaRepository<TypeViolation, Long> {}
