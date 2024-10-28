package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Violations;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Violations entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ViolationsRepository extends JpaRepository<Violations, Long> {}
