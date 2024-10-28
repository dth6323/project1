package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CCCDTestSamples.*;
import static com.mycompany.myapp.domain.VehicleRegistrationsTestSamples.*;
import static com.mycompany.myapp.domain.ViolationsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class VehicleRegistrationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VehicleRegistrations.class);
        VehicleRegistrations vehicleRegistrations1 = getVehicleRegistrationsSample1();
        VehicleRegistrations vehicleRegistrations2 = new VehicleRegistrations();
        assertThat(vehicleRegistrations1).isNotEqualTo(vehicleRegistrations2);

        vehicleRegistrations2.setId(vehicleRegistrations1.getId());
        assertThat(vehicleRegistrations1).isEqualTo(vehicleRegistrations2);

        vehicleRegistrations2 = getVehicleRegistrationsSample2();
        assertThat(vehicleRegistrations1).isNotEqualTo(vehicleRegistrations2);
    }

    @Test
    void violationsTest() {
        VehicleRegistrations vehicleRegistrations = getVehicleRegistrationsRandomSampleGenerator();
        Violations violationsBack = getViolationsRandomSampleGenerator();

        vehicleRegistrations.addViolations(violationsBack);
        assertThat(vehicleRegistrations.getViolations()).containsOnly(violationsBack);

        vehicleRegistrations.removeViolations(violationsBack);
        assertThat(vehicleRegistrations.getViolations()).doesNotContain(violationsBack);

        vehicleRegistrations.violations(new HashSet<>(Set.of(violationsBack)));
        assertThat(vehicleRegistrations.getViolations()).containsOnly(violationsBack);

        vehicleRegistrations.setViolations(new HashSet<>());
        assertThat(vehicleRegistrations.getViolations()).doesNotContain(violationsBack);
    }

    @Test
    void cCCDTest() {
        VehicleRegistrations vehicleRegistrations = getVehicleRegistrationsRandomSampleGenerator();
        CCCD cCCDBack = getCCCDRandomSampleGenerator();

        vehicleRegistrations.addCCCD(cCCDBack);
        assertThat(vehicleRegistrations.getCCCDS()).containsOnly(cCCDBack);
        assertThat(cCCDBack.getVehicleRegistrations()).isEqualTo(vehicleRegistrations);

        vehicleRegistrations.removeCCCD(cCCDBack);
        assertThat(vehicleRegistrations.getCCCDS()).doesNotContain(cCCDBack);
        assertThat(cCCDBack.getVehicleRegistrations()).isNull();

        vehicleRegistrations.cCCDS(new HashSet<>(Set.of(cCCDBack)));
        assertThat(vehicleRegistrations.getCCCDS()).containsOnly(cCCDBack);
        assertThat(cCCDBack.getVehicleRegistrations()).isEqualTo(vehicleRegistrations);

        vehicleRegistrations.setCCCDS(new HashSet<>());
        assertThat(vehicleRegistrations.getCCCDS()).doesNotContain(cCCDBack);
        assertThat(cCCDBack.getVehicleRegistrations()).isNull();
    }
}
