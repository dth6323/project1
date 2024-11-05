package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Violations;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Violations entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ViolationsRepository extends JpaRepository<Violations, Long> {
    @Query("SELECT v FROM Violations v JOIN v.vehicleRegistrations vr WHERE vr.vehicleNumber = :licensePlate")
    List<Violations> findByVehicleLicensePlate(@Param("licensePlate") String licensePlate);
}
