package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.TypeViolationTestSamples.*;
import static com.mycompany.myapp.domain.ViolationsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeViolationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeViolation.class);
        TypeViolation typeViolation1 = getTypeViolationSample1();
        TypeViolation typeViolation2 = new TypeViolation();
        assertThat(typeViolation1).isNotEqualTo(typeViolation2);

        typeViolation2.setId(typeViolation1.getId());
        assertThat(typeViolation1).isEqualTo(typeViolation2);

        typeViolation2 = getTypeViolationSample2();
        assertThat(typeViolation1).isNotEqualTo(typeViolation2);
    }

    @Test
    void violationsTest() {
        TypeViolation typeViolation = getTypeViolationRandomSampleGenerator();
        Violations violationsBack = getViolationsRandomSampleGenerator();

        typeViolation.setViolations(violationsBack);
        assertThat(typeViolation.getViolations()).isEqualTo(violationsBack);

        typeViolation.violations(null);
        assertThat(typeViolation.getViolations()).isNull();
    }
}
