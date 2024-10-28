package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.TypeViolationAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TypeViolation;
import com.mycompany.myapp.repository.TypeViolationRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link TypeViolationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeViolationResourceIT {

    private static final String DEFAULT_VIOLATION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_VIOLATION_NAME = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_FINE_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_FINE_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/type-violations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TypeViolationRepository typeViolationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeViolationMockMvc;

    private TypeViolation typeViolation;

    private TypeViolation insertedTypeViolation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeViolation createEntity() {
        return new TypeViolation().violationName(DEFAULT_VIOLATION_NAME).fineAmount(DEFAULT_FINE_AMOUNT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeViolation createUpdatedEntity() {
        return new TypeViolation().violationName(UPDATED_VIOLATION_NAME).fineAmount(UPDATED_FINE_AMOUNT);
    }

    @BeforeEach
    public void initTest() {
        typeViolation = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTypeViolation != null) {
            typeViolationRepository.delete(insertedTypeViolation);
            insertedTypeViolation = null;
        }
    }

    @Test
    @Transactional
    void createTypeViolation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the TypeViolation
        var returnedTypeViolation = om.readValue(
            restTypeViolationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(typeViolation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            TypeViolation.class
        );

        // Validate the TypeViolation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTypeViolationUpdatableFieldsEquals(returnedTypeViolation, getPersistedTypeViolation(returnedTypeViolation));

        insertedTypeViolation = returnedTypeViolation;
    }

    @Test
    @Transactional
    void createTypeViolationWithExistingId() throws Exception {
        // Create the TypeViolation with an existing ID
        typeViolation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeViolationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(typeViolation)))
            .andExpect(status().isBadRequest());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeViolations() throws Exception {
        // Initialize the database
        insertedTypeViolation = typeViolationRepository.saveAndFlush(typeViolation);

        // Get all the typeViolationList
        restTypeViolationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeViolation.getId().intValue())))
            .andExpect(jsonPath("$.[*].violationName").value(hasItem(DEFAULT_VIOLATION_NAME)))
            .andExpect(jsonPath("$.[*].fineAmount").value(hasItem(sameNumber(DEFAULT_FINE_AMOUNT))));
    }

    @Test
    @Transactional
    void getTypeViolation() throws Exception {
        // Initialize the database
        insertedTypeViolation = typeViolationRepository.saveAndFlush(typeViolation);

        // Get the typeViolation
        restTypeViolationMockMvc
            .perform(get(ENTITY_API_URL_ID, typeViolation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeViolation.getId().intValue()))
            .andExpect(jsonPath("$.violationName").value(DEFAULT_VIOLATION_NAME))
            .andExpect(jsonPath("$.fineAmount").value(sameNumber(DEFAULT_FINE_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingTypeViolation() throws Exception {
        // Get the typeViolation
        restTypeViolationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypeViolation() throws Exception {
        // Initialize the database
        insertedTypeViolation = typeViolationRepository.saveAndFlush(typeViolation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the typeViolation
        TypeViolation updatedTypeViolation = typeViolationRepository.findById(typeViolation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTypeViolation are not directly saved in db
        em.detach(updatedTypeViolation);
        updatedTypeViolation.violationName(UPDATED_VIOLATION_NAME).fineAmount(UPDATED_FINE_AMOUNT);

        restTypeViolationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeViolation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTypeViolation))
            )
            .andExpect(status().isOk());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTypeViolationToMatchAllProperties(updatedTypeViolation);
    }

    @Test
    @Transactional
    void putNonExistingTypeViolation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        typeViolation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeViolationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeViolation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(typeViolation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeViolation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        typeViolation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeViolationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(typeViolation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeViolation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        typeViolation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeViolationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(typeViolation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeViolationWithPatch() throws Exception {
        // Initialize the database
        insertedTypeViolation = typeViolationRepository.saveAndFlush(typeViolation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the typeViolation using partial update
        TypeViolation partialUpdatedTypeViolation = new TypeViolation();
        partialUpdatedTypeViolation.setId(typeViolation.getId());

        partialUpdatedTypeViolation.fineAmount(UPDATED_FINE_AMOUNT);

        restTypeViolationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeViolation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTypeViolation))
            )
            .andExpect(status().isOk());

        // Validate the TypeViolation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTypeViolationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedTypeViolation, typeViolation),
            getPersistedTypeViolation(typeViolation)
        );
    }

    @Test
    @Transactional
    void fullUpdateTypeViolationWithPatch() throws Exception {
        // Initialize the database
        insertedTypeViolation = typeViolationRepository.saveAndFlush(typeViolation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the typeViolation using partial update
        TypeViolation partialUpdatedTypeViolation = new TypeViolation();
        partialUpdatedTypeViolation.setId(typeViolation.getId());

        partialUpdatedTypeViolation.violationName(UPDATED_VIOLATION_NAME).fineAmount(UPDATED_FINE_AMOUNT);

        restTypeViolationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeViolation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTypeViolation))
            )
            .andExpect(status().isOk());

        // Validate the TypeViolation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTypeViolationUpdatableFieldsEquals(partialUpdatedTypeViolation, getPersistedTypeViolation(partialUpdatedTypeViolation));
    }

    @Test
    @Transactional
    void patchNonExistingTypeViolation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        typeViolation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeViolationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeViolation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(typeViolation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeViolation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        typeViolation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeViolationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(typeViolation))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeViolation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        typeViolation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeViolationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(typeViolation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeViolation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeViolation() throws Exception {
        // Initialize the database
        insertedTypeViolation = typeViolationRepository.saveAndFlush(typeViolation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the typeViolation
        restTypeViolationMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeViolation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return typeViolationRepository.count();
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

    protected TypeViolation getPersistedTypeViolation(TypeViolation typeViolation) {
        return typeViolationRepository.findById(typeViolation.getId()).orElseThrow();
    }

    protected void assertPersistedTypeViolationToMatchAllProperties(TypeViolation expectedTypeViolation) {
        assertTypeViolationAllPropertiesEquals(expectedTypeViolation, getPersistedTypeViolation(expectedTypeViolation));
    }

    protected void assertPersistedTypeViolationToMatchUpdatableProperties(TypeViolation expectedTypeViolation) {
        assertTypeViolationAllUpdatablePropertiesEquals(expectedTypeViolation, getPersistedTypeViolation(expectedTypeViolation));
    }
}
