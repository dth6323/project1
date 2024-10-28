package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.VehicleRegistrations;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface VehicleRegistrationsRepositoryWithBagRelationships {
    Optional<VehicleRegistrations> fetchBagRelationships(Optional<VehicleRegistrations> vehicleRegistrations);

    List<VehicleRegistrations> fetchBagRelationships(List<VehicleRegistrations> vehicleRegistrations);

    Page<VehicleRegistrations> fetchBagRelationships(Page<VehicleRegistrations> vehicleRegistrations);
}
