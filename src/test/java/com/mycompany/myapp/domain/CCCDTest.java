package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CCCDTestSamples.*;
import static com.mycompany.myapp.domain.VehicleRegistrationsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CCCDTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CCCD.class);
        CCCD cCCD1 = getCCCDSample1();
        CCCD cCCD2 = new CCCD();
        assertThat(cCCD1).isNotEqualTo(cCCD2);

        cCCD2.setId(cCCD1.getId());
        assertThat(cCCD1).isEqualTo(cCCD2);

        cCCD2 = getCCCDSample2();
        assertThat(cCCD1).isNotEqualTo(cCCD2);
    }

    @Test
    void vehicleRegistrationsTest() {
        CCCD cCCD = getCCCDRandomSampleGenerator();
        VehicleRegistrations vehicleRegistrationsBack = getVehicleRegistrationsRandomSampleGenerator();

        cCCD.setVehicleRegistrations(vehicleRegistrationsBack);
        assertThat(cCCD.getVehicleRegistrations()).isEqualTo(vehicleRegistrationsBack);

        cCCD.vehicleRegistrations(null);
        assertThat(cCCD.getVehicleRegistrations()).isNull();
    }
}
