package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ViolationsAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Violations;
import com.mycompany.myapp.repository.ViolationsRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ViolationsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ViolationsResourceIT {

    private static final Instant DEFAULT_VIOLATION_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_VIOLATION_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_EVIDENCE_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_EVIDENCE_IMAGE = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/violations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ViolationsRepository violationsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restViolationsMockMvc;

    private Violations violations;

    private Violations insertedViolations;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Violations createEntity() {
        return new Violations()
            .violationTime(DEFAULT_VIOLATION_TIME)
            .location(DEFAULT_LOCATION)
            .status(DEFAULT_STATUS)
            .evidenceImage(DEFAULT_EVIDENCE_IMAGE)
            .createdAt(DEFAULT_CREATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Violations createUpdatedEntity() {
        return new Violations()
            .violationTime(UPDATED_VIOLATION_TIME)
            .location(UPDATED_LOCATION)
            .status(UPDATED_STATUS)
            .evidenceImage(UPDATED_EVIDENCE_IMAGE)
            .createdAt(UPDATED_CREATED_AT);
    }

    @BeforeEach
    public void initTest() {
        violations = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedViolations != null) {
            violationsRepository.delete(insertedViolations);
            insertedViolations = null;
        }
    }

    @Test
    @Transactional
    void createViolations() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Violations
        var returnedViolations = om.readValue(
            restViolationsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(violations)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Violations.class
        );

        // Validate the Violations in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertViolationsUpdatableFieldsEquals(returnedViolations, getPersistedViolations(returnedViolations));

        insertedViolations = returnedViolations;
    }

    @Test
    @Transactional
    void createViolationsWithExistingId() throws Exception {
        // Create the Violations with an existing ID
        violations.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restViolationsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(violations)))
            .andExpect(status().isBadRequest());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllViolations() throws Exception {
        // Initialize the database
        insertedViolations = violationsRepository.saveAndFlush(violations);

        // Get all the violationsList
        restViolationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(violations.getId().intValue())))
            .andExpect(jsonPath("$.[*].violationTime").value(hasItem(DEFAULT_VIOLATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].evidenceImage").value(hasItem(DEFAULT_EVIDENCE_IMAGE)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @Test
    @Transactional
    void getViolations() throws Exception {
        // Initialize the database
        insertedViolations = violationsRepository.saveAndFlush(violations);

        // Get the violations
        restViolationsMockMvc
            .perform(get(ENTITY_API_URL_ID, violations.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(violations.getId().intValue()))
            .andExpect(jsonPath("$.violationTime").value(DEFAULT_VIOLATION_TIME.toString()))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.evidenceImage").value(DEFAULT_EVIDENCE_IMAGE))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingViolations() throws Exception {
        // Get the violations
        restViolationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingViolations() throws Exception {
        // Initialize the database
        insertedViolations = violationsRepository.saveAndFlush(violations);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the violations
        Violations updatedViolations = violationsRepository.findById(violations.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedViolations are not directly saved in db
        em.detach(updatedViolations);
        updatedViolations
            .violationTime(UPDATED_VIOLATION_TIME)
            .location(UPDATED_LOCATION)
            .status(UPDATED_STATUS)
            .evidenceImage(UPDATED_EVIDENCE_IMAGE)
            .createdAt(UPDATED_CREATED_AT);

        restViolationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedViolations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedViolations))
            )
            .andExpect(status().isOk());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedViolationsToMatchAllProperties(updatedViolations);
    }

    @Test
    @Transactional
    void putNonExistingViolations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        violations.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restViolationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, violations.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(violations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchViolations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        violations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViolationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(violations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamViolations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        violations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViolationsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(violations)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateViolationsWithPatch() throws Exception {
        // Initialize the database
        insertedViolations = violationsRepository.saveAndFlush(violations);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the violations using partial update
        Violations partialUpdatedViolations = new Violations();
        partialUpdatedViolations.setId(violations.getId());

        partialUpdatedViolations.location(UPDATED_LOCATION).evidenceImage(UPDATED_EVIDENCE_IMAGE).createdAt(UPDATED_CREATED_AT);

        restViolationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedViolations.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedViolations))
            )
            .andExpect(status().isOk());

        // Validate the Violations in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertViolationsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedViolations, violations),
            getPersistedViolations(violations)
        );
    }

    @Test
    @Transactional
    void fullUpdateViolationsWithPatch() throws Exception {
        // Initialize the database
        insertedViolations = violationsRepository.saveAndFlush(violations);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the violations using partial update
        Violations partialUpdatedViolations = new Violations();
        partialUpdatedViolations.setId(violations.getId());

        partialUpdatedViolations
            .violationTime(UPDATED_VIOLATION_TIME)
            .location(UPDATED_LOCATION)
            .status(UPDATED_STATUS)
            .evidenceImage(UPDATED_EVIDENCE_IMAGE)
            .createdAt(UPDATED_CREATED_AT);

        restViolationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedViolations.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedViolations))
            )
            .andExpect(status().isOk());

        // Validate the Violations in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertViolationsUpdatableFieldsEquals(partialUpdatedViolations, getPersistedViolations(partialUpdatedViolations));
    }

    @Test
    @Transactional
    void patchNonExistingViolations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        violations.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restViolationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, violations.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(violations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchViolations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        violations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViolationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(violations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamViolations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        violations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViolationsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(violations)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Violations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteViolations() throws Exception {
        // Initialize the database
        insertedViolations = violationsRepository.saveAndFlush(violations);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the violations
        restViolationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, violations.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return violationsRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Violations getPersistedViolations(Violations violations) {
        return violationsRepository.findById(violations.getId()).orElseThrow();
    }

    protected void assertPersistedViolationsToMatchAllProperties(Violations expectedViolations) {
        assertViolationsAllPropertiesEquals(expectedViolations, getPersistedViolations(expectedViolations));
    }

    protected void assertPersistedViolationsToMatchUpdatableProperties(Violations expectedViolations) {
        assertViolationsAllUpdatablePropertiesEquals(expectedViolations, getPersistedViolations(expectedViolations));
    }
}
