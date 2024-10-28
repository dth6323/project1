package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.VehicleRegistrations;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VehicleRegistrations entity.
 *
 * When extending this class, extend VehicleRegistrationsRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface VehicleRegistrationsRepository
    extends VehicleRegistrationsRepositoryWithBagRelationships, JpaRepository<VehicleRegistrations, Long> {
    default Optional<VehicleRegistrations> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<VehicleRegistrations> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<VehicleRegistrations> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
