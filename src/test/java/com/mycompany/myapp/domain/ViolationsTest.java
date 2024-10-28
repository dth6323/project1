package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.TypeViolationTestSamples.*;
import static com.mycompany.myapp.domain.VehicleRegistrationsTestSamples.*;
import static com.mycompany.myapp.domain.ViolationsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ViolationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Violations.class);
        Violations violations1 = getViolationsSample1();
        Violations violations2 = new Violations();
        assertThat(violations1).isNotEqualTo(violations2);

        violations2.setId(violations1.getId());
        assertThat(violations1).isEqualTo(violations2);

        violations2 = getViolationsSample2();
        assertThat(violations1).isNotEqualTo(violations2);
    }

    @Test
    void typeViolationTest() {
        Violations violations = getViolationsRandomSampleGenerator();
        TypeViolation typeViolationBack = getTypeViolationRandomSampleGenerator();

        violations.addTypeViolation(typeViolationBack);
        assertThat(violations.getTypeViolations()).containsOnly(typeViolationBack);
        assertThat(typeViolationBack.getViolations()).isEqualTo(violations);

        violations.removeTypeViolation(typeViolationBack);
        assertThat(violations.getTypeViolations()).doesNotContain(typeViolationBack);
        assertThat(typeViolationBack.getViolations()).isNull();

        violations.typeViolations(new HashSet<>(Set.of(typeViolationBack)));
        assertThat(violations.getTypeViolations()).containsOnly(typeViolationBack);
        assertThat(typeViolationBack.getViolations()).isEqualTo(violations);

        violations.setTypeViolations(new HashSet<>());
        assertThat(violations.getTypeViolations()).doesNotContain(typeViolationBack);
        assertThat(typeViolationBack.getViolations()).isNull();
    }

    @Test
    void vehicleRegistrationsTest() {
        Violations violations = getViolationsRandomSampleGenerator();
        VehicleRegistrations vehicleRegistrationsBack = getVehicleRegistrationsRandomSampleGenerator();

        violations.addVehicleRegistrations(vehicleRegistrationsBack);
        assertThat(violations.getVehicleRegistrations()).containsOnly(vehicleRegistrationsBack);
        assertThat(vehicleRegistrationsBack.getViolations()).containsOnly(violations);

        violations.removeVehicleRegistrations(vehicleRegistrationsBack);
        assertThat(violations.getVehicleRegistrations()).doesNotContain(vehicleRegistrationsBack);
        assertThat(vehicleRegistrationsBack.getViolations()).doesNotContain(violations);

        violations.vehicleRegistrations(new HashSet<>(Set.of(vehicleRegistrationsBack)));
        assertThat(violations.getVehicleRegistrations()).containsOnly(vehicleRegistrationsBack);
        assertThat(vehicleRegistrationsBack.getViolations()).containsOnly(violations);

        violations.setVehicleRegistrations(new HashSet<>());
        assertThat(violations.getVehicleRegistrations()).doesNotContain(vehicleRegistrationsBack);
        assertThat(vehicleRegistrationsBack.getViolations()).doesNotContain(violations);
    }
}
