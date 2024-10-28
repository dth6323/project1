package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.VehicleRegistrations;
import com.mycompany.myapp.repository.VehicleRegistrationsRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.VehicleRegistrations}.
 */
@RestController
@RequestMapping("/api/vehicle-registrations")
@Transactional
public class VehicleRegistrationsResource {

    private static final Logger LOG = LoggerFactory.getLogger(VehicleRegistrationsResource.class);

    private static final String ENTITY_NAME = "vehicleRegistrations";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VehicleRegistrationsRepository vehicleRegistrationsRepository;

    public VehicleRegistrationsResource(VehicleRegistrationsRepository vehicleRegistrationsRepository) {
        this.vehicleRegistrationsRepository = vehicleRegistrationsRepository;
    }

    /**
     * {@code POST  /vehicle-registrations} : Create a new vehicleRegistrations.
     *
     * @param vehicleRegistrations the vehicleRegistrations to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vehicleRegistrations, or with status {@code 400 (Bad Request)} if the vehicleRegistrations has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<VehicleRegistrations> createVehicleRegistrations(@RequestBody VehicleRegistrations vehicleRegistrations)
        throws URISyntaxException {
        LOG.debug("REST request to save VehicleRegistrations : {}", vehicleRegistrations);
        if (vehicleRegistrations.getId() != null) {
            throw new BadRequestAlertException("A new vehicleRegistrations cannot already have an ID", ENTITY_NAME, "idexists");
        }
        vehicleRegistrations = vehicleRegistrationsRepository.save(vehicleRegistrations);
        return ResponseEntity.created(new URI("/api/vehicle-registrations/" + vehicleRegistrations.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, vehicleRegistrations.getId().toString()))
            .body(vehicleRegistrations);
    }

    /**
     * {@code PUT  /vehicle-registrations/:id} : Updates an existing vehicleRegistrations.
     *
     * @param id the id of the vehicleRegistrations to save.
     * @param vehicleRegistrations the vehicleRegistrations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehicleRegistrations,
     * or with status {@code 400 (Bad Request)} if the vehicleRegistrations is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vehicleRegistrations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VehicleRegistrations> updateVehicleRegistrations(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VehicleRegistrations vehicleRegistrations
    ) throws URISyntaxException {
        LOG.debug("REST request to update VehicleRegistrations : {}, {}", id, vehicleRegistrations);
        if (vehicleRegistrations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehicleRegistrations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehicleRegistrationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        vehicleRegistrations = vehicleRegistrationsRepository.save(vehicleRegistrations);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehicleRegistrations.getId().toString()))
            .body(vehicleRegistrations);
    }

    /**
     * {@code PATCH  /vehicle-registrations/:id} : Partial updates given fields of an existing vehicleRegistrations, field will ignore if it is null
     *
     * @param id the id of the vehicleRegistrations to save.
     * @param vehicleRegistrations the vehicleRegistrations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehicleRegistrations,
     * or with status {@code 400 (Bad Request)} if the vehicleRegistrations is not valid,
     * or with status {@code 404 (Not Found)} if the vehicleRegistrations is not found,
     * or with status {@code 500 (Internal Server Error)} if the vehicleRegistrations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VehicleRegistrations> partialUpdateVehicleRegistrations(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VehicleRegistrations vehicleRegistrations
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update VehicleRegistrations partially : {}, {}", id, vehicleRegistrations);
        if (vehicleRegistrations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehicleRegistrations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehicleRegistrationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VehicleRegistrations> result = vehicleRegistrationsRepository
            .findById(vehicleRegistrations.getId())
            .map(existingVehicleRegistrations -> {
                if (vehicleRegistrations.getVehicleNumber() != null) {
                    existingVehicleRegistrations.setVehicleNumber(vehicleRegistrations.getVehicleNumber());
                }
                if (vehicleRegistrations.getOwnerName() != null) {
                    existingVehicleRegistrations.setOwnerName(vehicleRegistrations.getOwnerName());
                }
                if (vehicleRegistrations.getEngineNum() != null) {
                    existingVehicleRegistrations.setEngineNum(vehicleRegistrations.getEngineNum());
                }
                if (vehicleRegistrations.getChassisNum() != null) {
                    existingVehicleRegistrations.setChassisNum(vehicleRegistrations.getChassisNum());
                }
                if (vehicleRegistrations.getVehicleType() != null) {
                    existingVehicleRegistrations.setVehicleType(vehicleRegistrations.getVehicleType());
                }
                if (vehicleRegistrations.getBrand() != null) {
                    existingVehicleRegistrations.setBrand(vehicleRegistrations.getBrand());
                }
                if (vehicleRegistrations.getModelCode() != null) {
                    existingVehicleRegistrations.setModelCode(vehicleRegistrations.getModelCode());
                }
                if (vehicleRegistrations.getColor() != null) {
                    existingVehicleRegistrations.setColor(vehicleRegistrations.getColor());
                }
                if (vehicleRegistrations.getCapacity() != null) {
                    existingVehicleRegistrations.setCapacity(vehicleRegistrations.getCapacity());
                }
                if (vehicleRegistrations.getRegistrationDate() != null) {
                    existingVehicleRegistrations.setRegistrationDate(vehicleRegistrations.getRegistrationDate());
                }
                if (vehicleRegistrations.getExpirationDate() != null) {
                    existingVehicleRegistrations.setExpirationDate(vehicleRegistrations.getExpirationDate());
                }
                if (vehicleRegistrations.getIssuedBy() != null) {
                    existingVehicleRegistrations.setIssuedBy(vehicleRegistrations.getIssuedBy());
                }

                return existingVehicleRegistrations;
            })
            .map(vehicleRegistrationsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehicleRegistrations.getId().toString())
        );
    }

    /**
     * {@code GET  /vehicle-registrations} : get all the vehicleRegistrations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vehicleRegistrations in body.
     */
    @GetMapping("")
    public List<VehicleRegistrations> getAllVehicleRegistrations(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all VehicleRegistrations");
        if (eagerload) {
            return vehicleRegistrationsRepository.findAllWithEagerRelationships();
        } else {
            return vehicleRegistrationsRepository.findAll();
        }
    }

    /**
     * {@code GET  /vehicle-registrations/:id} : get the "id" vehicleRegistrations.
     *
     * @param id the id of the vehicleRegistrations to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vehicleRegistrations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VehicleRegistrations> getVehicleRegistrations(@PathVariable("id") Long id) {
        LOG.debug("REST request to get VehicleRegistrations : {}", id);
        Optional<VehicleRegistrations> vehicleRegistrations = vehicleRegistrationsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(vehicleRegistrations);
    }

    /**
     * {@code DELETE  /vehicle-registrations/:id} : delete the "id" vehicleRegistrations.
     *
     * @param id the id of the vehicleRegistrations to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicleRegistrations(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete VehicleRegistrations : {}", id);
        vehicleRegistrationsRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
