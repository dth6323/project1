package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TypeViolation;
import com.mycompany.myapp.repository.TypeViolationRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TypeViolation}.
 */
@RestController
@RequestMapping("/api/type-violations")
@Transactional
public class TypeViolationResource {

    private static final Logger LOG = LoggerFactory.getLogger(TypeViolationResource.class);

    private static final String ENTITY_NAME = "typeViolation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeViolationRepository typeViolationRepository;

    public TypeViolationResource(TypeViolationRepository typeViolationRepository) {
        this.typeViolationRepository = typeViolationRepository;
    }

    /**
     * {@code POST  /type-violations} : Create a new typeViolation.
     *
     * @param typeViolation the typeViolation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeViolation, or with status {@code 400 (Bad Request)} if the typeViolation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TypeViolation> createTypeViolation(@RequestBody TypeViolation typeViolation) throws URISyntaxException {
        LOG.debug("REST request to save TypeViolation : {}", typeViolation);
        if (typeViolation.getId() != null) {
            throw new BadRequestAlertException("A new typeViolation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        typeViolation = typeViolationRepository.save(typeViolation);
        return ResponseEntity.created(new URI("/api/type-violations/" + typeViolation.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, typeViolation.getId().toString()))
            .body(typeViolation);
    }

    /**
     * {@code PUT  /type-violations/:id} : Updates an existing typeViolation.
     *
     * @param id the id of the typeViolation to save.
     * @param typeViolation the typeViolation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeViolation,
     * or with status {@code 400 (Bad Request)} if the typeViolation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeViolation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TypeViolation> updateTypeViolation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeViolation typeViolation
    ) throws URISyntaxException {
        LOG.debug("REST request to update TypeViolation : {}, {}", id, typeViolation);
        if (typeViolation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeViolation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeViolationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        typeViolation = typeViolationRepository.save(typeViolation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeViolation.getId().toString()))
            .body(typeViolation);
    }

    /**
     * {@code PATCH  /type-violations/:id} : Partial updates given fields of an existing typeViolation, field will ignore if it is null
     *
     * @param id the id of the typeViolation to save.
     * @param typeViolation the typeViolation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeViolation,
     * or with status {@code 400 (Bad Request)} if the typeViolation is not valid,
     * or with status {@code 404 (Not Found)} if the typeViolation is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeViolation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeViolation> partialUpdateTypeViolation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeViolation typeViolation
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TypeViolation partially : {}, {}", id, typeViolation);
        if (typeViolation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeViolation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeViolationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeViolation> result = typeViolationRepository
            .findById(typeViolation.getId())
            .map(existingTypeViolation -> {
                if (typeViolation.getViolationName() != null) {
                    existingTypeViolation.setViolationName(typeViolation.getViolationName());
                }
                if (typeViolation.getFineAmount() != null) {
                    existingTypeViolation.setFineAmount(typeViolation.getFineAmount());
                }

                return existingTypeViolation;
            })
            .map(typeViolationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeViolation.getId().toString())
        );
    }

    /**
     * {@code GET  /type-violations} : get all the typeViolations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeViolations in body.
     */
    @GetMapping("")
    public List<TypeViolation> getAllTypeViolations() {
        LOG.debug("REST request to get all TypeViolations");
        return typeViolationRepository.findAll();
    }

    /**
     * {@code GET  /type-violations/:id} : get the "id" typeViolation.
     *
     * @param id the id of the typeViolation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeViolation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TypeViolation> getTypeViolation(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TypeViolation : {}", id);
        Optional<TypeViolation> typeViolation = typeViolationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeViolation);
    }

    /**
     * {@code DELETE  /type-violations/:id} : delete the "id" typeViolation.
     *
     * @param id the id of the typeViolation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTypeViolation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TypeViolation : {}", id);
        typeViolationRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
