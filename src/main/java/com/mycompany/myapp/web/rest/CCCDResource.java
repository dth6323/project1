package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CCCD;
import com.mycompany.myapp.repository.CCCDRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CCCD}.
 */
@RestController
@RequestMapping("/api/cccds")
@Transactional
public class CCCDResource {

    private static final Logger LOG = LoggerFactory.getLogger(CCCDResource.class);

    private static final String ENTITY_NAME = "cCCD";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CCCDRepository cCCDRepository;

    public CCCDResource(CCCDRepository cCCDRepository) {
        this.cCCDRepository = cCCDRepository;
    }

    /**
     * {@code POST  /cccds} : Create a new cCCD.
     *
     * @param cCCD the cCCD to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cCCD, or with status {@code 400 (Bad Request)} if the cCCD has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CCCD> createCCCD(@RequestBody CCCD cCCD) throws URISyntaxException {
        LOG.debug("REST request to save CCCD : {}", cCCD);
        if (cCCD.getId() != null) {
            throw new BadRequestAlertException("A new cCCD cannot already have an ID", ENTITY_NAME, "idexists");
        }
        cCCD = cCCDRepository.save(cCCD);
        return ResponseEntity.created(new URI("/api/cccds/" + cCCD.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, cCCD.getId().toString()))
            .body(cCCD);
    }

    /**
     * {@code PUT  /cccds/:id} : Updates an existing cCCD.
     *
     * @param id the id of the cCCD to save.
     * @param cCCD the cCCD to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cCCD,
     * or with status {@code 400 (Bad Request)} if the cCCD is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cCCD couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CCCD> updateCCCD(@PathVariable(value = "id", required = false) final Long id, @RequestBody CCCD cCCD)
        throws URISyntaxException {
        LOG.debug("REST request to update CCCD : {}, {}", id, cCCD);
        if (cCCD.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cCCD.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cCCDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        cCCD = cCCDRepository.save(cCCD);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cCCD.getId().toString()))
            .body(cCCD);
    }

    /**
     * {@code PATCH  /cccds/:id} : Partial updates given fields of an existing cCCD, field will ignore if it is null
     *
     * @param id the id of the cCCD to save.
     * @param cCCD the cCCD to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cCCD,
     * or with status {@code 400 (Bad Request)} if the cCCD is not valid,
     * or with status {@code 404 (Not Found)} if the cCCD is not found,
     * or with status {@code 500 (Internal Server Error)} if the cCCD couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CCCD> partialUpdateCCCD(@PathVariable(value = "id", required = false) final Long id, @RequestBody CCCD cCCD)
        throws URISyntaxException {
        LOG.debug("REST request to partial update CCCD partially : {}, {}", id, cCCD);
        if (cCCD.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cCCD.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cCCDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CCCD> result = cCCDRepository
            .findById(cCCD.getId())
            .map(existingCCCD -> {
                if (cCCD.getFullName() != null) {
                    existingCCCD.setFullName(cCCD.getFullName());
                }
                if (cCCD.getDateBirth() != null) {
                    existingCCCD.setDateBirth(cCCD.getDateBirth());
                }
                if (cCCD.getSex() != null) {
                    existingCCCD.setSex(cCCD.getSex());
                }
                if (cCCD.getNationality() != null) {
                    existingCCCD.setNationality(cCCD.getNationality());
                }
                if (cCCD.getPlaceOrigin() != null) {
                    existingCCCD.setPlaceOrigin(cCCD.getPlaceOrigin());
                }
                if (cCCD.getPlaceResidence() != null) {
                    existingCCCD.setPlaceResidence(cCCD.getPlaceResidence());
                }
                if (cCCD.getDateIssue() != null) {
                    existingCCCD.setDateIssue(cCCD.getDateIssue());
                }
                if (cCCD.getDateExpiry() != null) {
                    existingCCCD.setDateExpiry(cCCD.getDateExpiry());
                }
                if (cCCD.getPersonalIdentification() != null) {
                    existingCCCD.setPersonalIdentification(cCCD.getPersonalIdentification());
                }

                return existingCCCD;
            })
            .map(cCCDRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cCCD.getId().toString())
        );
    }

    /**
     * {@code GET  /cccds} : get all the cCCDS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cCCDS in body.
     */
    @GetMapping("")
    public List<CCCD> getAllCCCDS() {
        LOG.debug("REST request to get all CCCDS");
        return cCCDRepository.findAll();
    }

    /**
     * {@code GET  /cccds/:id} : get the "id" cCCD.
     *
     * @param id the id of the cCCD to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cCCD, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CCCD> getCCCD(@PathVariable("id") Long id) {
        LOG.debug("REST request to get CCCD : {}", id);
        Optional<CCCD> cCCD = cCCDRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cCCD);
    }

    /**
     * {@code DELETE  /cccds/:id} : delete the "id" cCCD.
     *
     * @param id the id of the cCCD to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCCCD(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete CCCD : {}", id);
        cCCDRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
