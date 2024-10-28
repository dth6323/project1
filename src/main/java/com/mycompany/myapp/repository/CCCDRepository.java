package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CCCD;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CCCD entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CCCDRepository extends JpaRepository<CCCD, Long> {}
