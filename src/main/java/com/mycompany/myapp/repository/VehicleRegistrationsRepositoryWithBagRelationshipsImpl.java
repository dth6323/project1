package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.VehicleRegistrations;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class VehicleRegistrationsRepositoryWithBagRelationshipsImpl implements VehicleRegistrationsRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String VEHICLEREGISTRATIONS_PARAMETER = "vehicleRegistrations";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<VehicleRegistrations> fetchBagRelationships(Optional<VehicleRegistrations> vehicleRegistrations) {
        return vehicleRegistrations.map(this::fetchViolations);
    }

    @Override
    public Page<VehicleRegistrations> fetchBagRelationships(Page<VehicleRegistrations> vehicleRegistrations) {
        return new PageImpl<>(
            fetchBagRelationships(vehicleRegistrations.getContent()),
            vehicleRegistrations.getPageable(),
            vehicleRegistrations.getTotalElements()
        );
    }

    @Override
    public List<VehicleRegistrations> fetchBagRelationships(List<VehicleRegistrations> vehicleRegistrations) {
        return Optional.of(vehicleRegistrations).map(this::fetchViolations).orElse(Collections.emptyList());
    }

    VehicleRegistrations fetchViolations(VehicleRegistrations result) {
        return entityManager
            .createQuery(
                "select vehicleRegistrations from VehicleRegistrations vehicleRegistrations left join fetch vehicleRegistrations.violations where vehicleRegistrations.id = :id",
                VehicleRegistrations.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<VehicleRegistrations> fetchViolations(List<VehicleRegistrations> vehicleRegistrations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, vehicleRegistrations.size()).forEach(index -> order.put(vehicleRegistrations.get(index).getId(), index));
        List<VehicleRegistrations> result = entityManager
            .createQuery(
                "select vehicleRegistrations from VehicleRegistrations vehicleRegistrations left join fetch vehicleRegistrations.violations where vehicleRegistrations in :vehicleRegistrations",
                VehicleRegistrations.class
            )
            .setParameter(VEHICLEREGISTRATIONS_PARAMETER, vehicleRegistrations)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
