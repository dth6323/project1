package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.VehicleRegistrationsAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.VehicleRegistrations;
import com.mycompany.myapp.repository.VehicleRegistrationsRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VehicleRegistrationsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VehicleRegistrationsResourceIT {

    private static final String DEFAULT_VEHICLE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_VEHICLE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_OWNER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_OWNER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ENGINE_NUM = "AAAAAAAAAA";
    private static final String UPDATED_ENGINE_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_CHASSIS_NUM = "AAAAAAAAAA";
    private static final String UPDATED_CHASSIS_NUM = "BBBBBBBBBB";

    private static final String DEFAULT_VEHICLE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_VEHICLE_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_BRAND = "AAAAAAAAAA";
    private static final String UPDATED_BRAND = "BBBBBBBBBB";

    private static final String DEFAULT_MODEL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_MODEL_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    private static final String DEFAULT_CAPACITY = "AAAAAAAAAA";
    private static final String UPDATED_CAPACITY = "BBBBBBBBBB";

    private static final Instant DEFAULT_REGISTRATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REGISTRATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_EXPIRATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPIRATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ISSUED_BY = "AAAAAAAAAA";
    private static final String UPDATED_ISSUED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vehicle-registrations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private VehicleRegistrationsRepository vehicleRegistrationsRepository;

    @Mock
    private VehicleRegistrationsRepository vehicleRegistrationsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVehicleRegistrationsMockMvc;

    private VehicleRegistrations vehicleRegistrations;

    private VehicleRegistrations insertedVehicleRegistrations;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VehicleRegistrations createEntity() {
        return new VehicleRegistrations()
            .vehicleNumber(DEFAULT_VEHICLE_NUMBER)
            .ownerName(DEFAULT_OWNER_NAME)
            .engineNum(DEFAULT_ENGINE_NUM)
            .chassisNum(DEFAULT_CHASSIS_NUM)
            .vehicleType(DEFAULT_VEHICLE_TYPE)
            .brand(DEFAULT_BRAND)
            .modelCode(DEFAULT_MODEL_CODE)
            .color(DEFAULT_COLOR)
            .capacity(DEFAULT_CAPACITY)
            .registrationDate(DEFAULT_REGISTRATION_DATE)
            .expirationDate(DEFAULT_EXPIRATION_DATE)
            .issuedBy(DEFAULT_ISSUED_BY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VehicleRegistrations createUpdatedEntity() {
        return new VehicleRegistrations()
            .vehicleNumber(UPDATED_VEHICLE_NUMBER)
            .ownerName(UPDATED_OWNER_NAME)
            .engineNum(UPDATED_ENGINE_NUM)
            .chassisNum(UPDATED_CHASSIS_NUM)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .brand(UPDATED_BRAND)
            .modelCode(UPDATED_MODEL_CODE)
            .color(UPDATED_COLOR)
            .capacity(UPDATED_CAPACITY)
            .registrationDate(UPDATED_REGISTRATION_DATE)
            .expirationDate(UPDATED_EXPIRATION_DATE)
            .issuedBy(UPDATED_ISSUED_BY);
    }

    @BeforeEach
    public void initTest() {
        vehicleRegistrations = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedVehicleRegistrations != null) {
            vehicleRegistrationsRepository.delete(insertedVehicleRegistrations);
            insertedVehicleRegistrations = null;
        }
    }

    @Test
    @Transactional
    void createVehicleRegistrations() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the VehicleRegistrations
        var returnedVehicleRegistrations = om.readValue(
            restVehicleRegistrationsMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vehicleRegistrations)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            VehicleRegistrations.class
        );

        // Validate the VehicleRegistrations in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertVehicleRegistrationsUpdatableFieldsEquals(
            returnedVehicleRegistrations,
            getPersistedVehicleRegistrations(returnedVehicleRegistrations)
        );

        insertedVehicleRegistrations = returnedVehicleRegistrations;
    }

    @Test
    @Transactional
    void createVehicleRegistrationsWithExistingId() throws Exception {
        // Create the VehicleRegistrations with an existing ID
        vehicleRegistrations.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVehicleRegistrationsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vehicleRegistrations)))
            .andExpect(status().isBadRequest());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVehicleRegistrations() throws Exception {
        // Initialize the database
        insertedVehicleRegistrations = vehicleRegistrationsRepository.saveAndFlush(vehicleRegistrations);

        // Get all the vehicleRegistrationsList
        restVehicleRegistrationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vehicleRegistrations.getId().intValue())))
            .andExpect(jsonPath("$.[*].vehicleNumber").value(hasItem(DEFAULT_VEHICLE_NUMBER)))
            .andExpect(jsonPath("$.[*].ownerName").value(hasItem(DEFAULT_OWNER_NAME)))
            .andExpect(jsonPath("$.[*].engineNum").value(hasItem(DEFAULT_ENGINE_NUM)))
            .andExpect(jsonPath("$.[*].chassisNum").value(hasItem(DEFAULT_CHASSIS_NUM)))
            .andExpect(jsonPath("$.[*].vehicleType").value(hasItem(DEFAULT_VEHICLE_TYPE)))
            .andExpect(jsonPath("$.[*].brand").value(hasItem(DEFAULT_BRAND)))
            .andExpect(jsonPath("$.[*].modelCode").value(hasItem(DEFAULT_MODEL_CODE)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)))
            .andExpect(jsonPath("$.[*].registrationDate").value(hasItem(DEFAULT_REGISTRATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].expirationDate").value(hasItem(DEFAULT_EXPIRATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].issuedBy").value(hasItem(DEFAULT_ISSUED_BY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVehicleRegistrationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(vehicleRegistrationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVehicleRegistrationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(vehicleRegistrationsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVehicleRegistrationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(vehicleRegistrationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVehicleRegistrationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(vehicleRegistrationsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVehicleRegistrations() throws Exception {
        // Initialize the database
        insertedVehicleRegistrations = vehicleRegistrationsRepository.saveAndFlush(vehicleRegistrations);

        // Get the vehicleRegistrations
        restVehicleRegistrationsMockMvc
            .perform(get(ENTITY_API_URL_ID, vehicleRegistrations.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vehicleRegistrations.getId().intValue()))
            .andExpect(jsonPath("$.vehicleNumber").value(DEFAULT_VEHICLE_NUMBER))
            .andExpect(jsonPath("$.ownerName").value(DEFAULT_OWNER_NAME))
            .andExpect(jsonPath("$.engineNum").value(DEFAULT_ENGINE_NUM))
            .andExpect(jsonPath("$.chassisNum").value(DEFAULT_CHASSIS_NUM))
            .andExpect(jsonPath("$.vehicleType").value(DEFAULT_VEHICLE_TYPE))
            .andExpect(jsonPath("$.brand").value(DEFAULT_BRAND))
            .andExpect(jsonPath("$.modelCode").value(DEFAULT_MODEL_CODE))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY))
            .andExpect(jsonPath("$.registrationDate").value(DEFAULT_REGISTRATION_DATE.toString()))
            .andExpect(jsonPath("$.expirationDate").value(DEFAULT_EXPIRATION_DATE.toString()))
            .andExpect(jsonPath("$.issuedBy").value(DEFAULT_ISSUED_BY));
    }

    @Test
    @Transactional
    void getNonExistingVehicleRegistrations() throws Exception {
        // Get the vehicleRegistrations
        restVehicleRegistrationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVehicleRegistrations() throws Exception {
        // Initialize the database
        insertedVehicleRegistrations = vehicleRegistrationsRepository.saveAndFlush(vehicleRegistrations);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vehicleRegistrations
        VehicleRegistrations updatedVehicleRegistrations = vehicleRegistrationsRepository
            .findById(vehicleRegistrations.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedVehicleRegistrations are not directly saved in db
        em.detach(updatedVehicleRegistrations);
        updatedVehicleRegistrations
            .vehicleNumber(UPDATED_VEHICLE_NUMBER)
            .ownerName(UPDATED_OWNER_NAME)
            .engineNum(UPDATED_ENGINE_NUM)
            .chassisNum(UPDATED_CHASSIS_NUM)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .brand(UPDATED_BRAND)
            .modelCode(UPDATED_MODEL_CODE)
            .color(UPDATED_COLOR)
            .capacity(UPDATED_CAPACITY)
            .registrationDate(UPDATED_REGISTRATION_DATE)
            .expirationDate(UPDATED_EXPIRATION_DATE)
            .issuedBy(UPDATED_ISSUED_BY);

        restVehicleRegistrationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVehicleRegistrations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedVehicleRegistrations))
            )
            .andExpect(status().isOk());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedVehicleRegistrationsToMatchAllProperties(updatedVehicleRegistrations);
    }

    @Test
    @Transactional
    void putNonExistingVehicleRegistrations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleRegistrations.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleRegistrationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vehicleRegistrations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vehicleRegistrations))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVehicleRegistrations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleRegistrations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleRegistrationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vehicleRegistrations))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVehicleRegistrations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleRegistrations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleRegistrationsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vehicleRegistrations)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVehicleRegistrationsWithPatch() throws Exception {
        // Initialize the database
        insertedVehicleRegistrations = vehicleRegistrationsRepository.saveAndFlush(vehicleRegistrations);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vehicleRegistrations using partial update
        VehicleRegistrations partialUpdatedVehicleRegistrations = new VehicleRegistrations();
        partialUpdatedVehicleRegistrations.setId(vehicleRegistrations.getId());

        partialUpdatedVehicleRegistrations
            .vehicleNumber(UPDATED_VEHICLE_NUMBER)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .brand(UPDATED_BRAND)
            .capacity(UPDATED_CAPACITY)
            .expirationDate(UPDATED_EXPIRATION_DATE)
            .issuedBy(UPDATED_ISSUED_BY);

        restVehicleRegistrationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicleRegistrations.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVehicleRegistrations))
            )
            .andExpect(status().isOk());

        // Validate the VehicleRegistrations in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVehicleRegistrationsUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedVehicleRegistrations, vehicleRegistrations),
            getPersistedVehicleRegistrations(vehicleRegistrations)
        );
    }

    @Test
    @Transactional
    void fullUpdateVehicleRegistrationsWithPatch() throws Exception {
        // Initialize the database
        insertedVehicleRegistrations = vehicleRegistrationsRepository.saveAndFlush(vehicleRegistrations);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vehicleRegistrations using partial update
        VehicleRegistrations partialUpdatedVehicleRegistrations = new VehicleRegistrations();
        partialUpdatedVehicleRegistrations.setId(vehicleRegistrations.getId());

        partialUpdatedVehicleRegistrations
            .vehicleNumber(UPDATED_VEHICLE_NUMBER)
            .ownerName(UPDATED_OWNER_NAME)
            .engineNum(UPDATED_ENGINE_NUM)
            .chassisNum(UPDATED_CHASSIS_NUM)
            .vehicleType(UPDATED_VEHICLE_TYPE)
            .brand(UPDATED_BRAND)
            .modelCode(UPDATED_MODEL_CODE)
            .color(UPDATED_COLOR)
            .capacity(UPDATED_CAPACITY)
            .registrationDate(UPDATED_REGISTRATION_DATE)
            .expirationDate(UPDATED_EXPIRATION_DATE)
            .issuedBy(UPDATED_ISSUED_BY);

        restVehicleRegistrationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicleRegistrations.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVehicleRegistrations))
            )
            .andExpect(status().isOk());

        // Validate the VehicleRegistrations in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVehicleRegistrationsUpdatableFieldsEquals(
            partialUpdatedVehicleRegistrations,
            getPersistedVehicleRegistrations(partialUpdatedVehicleRegistrations)
        );
    }

    @Test
    @Transactional
    void patchNonExistingVehicleRegistrations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleRegistrations.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleRegistrationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vehicleRegistrations.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vehicleRegistrations))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVehicleRegistrations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleRegistrations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleRegistrationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vehicleRegistrations))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVehicleRegistrations() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vehicleRegistrations.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleRegistrationsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(vehicleRegistrations)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VehicleRegistrations in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVehicleRegistrations() throws Exception {
        // Initialize the database
        insertedVehicleRegistrations = vehicleRegistrationsRepository.saveAndFlush(vehicleRegistrations);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the vehicleRegistrations
        restVehicleRegistrationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, vehicleRegistrations.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return vehicleRegistrationsRepository.count();
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

    protected VehicleRegistrations getPersistedVehicleRegistrations(VehicleRegistrations vehicleRegistrations) {
        return vehicleRegistrationsRepository.findById(vehicleRegistrations.getId()).orElseThrow();
    }

    protected void assertPersistedVehicleRegistrationsToMatchAllProperties(VehicleRegistrations expectedVehicleRegistrations) {
        assertVehicleRegistrationsAllPropertiesEquals(
            expectedVehicleRegistrations,
            getPersistedVehicleRegistrations(expectedVehicleRegistrations)
        );
    }

    protected void assertPersistedVehicleRegistrationsToMatchUpdatableProperties(VehicleRegistrations expectedVehicleRegistrations) {
        assertVehicleRegistrationsAllUpdatablePropertiesEquals(
            expectedVehicleRegistrations,
            getPersistedVehicleRegistrations(expectedVehicleRegistrations)
        );
    }
}
