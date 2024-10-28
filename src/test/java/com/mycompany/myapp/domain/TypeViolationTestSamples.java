package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TypeViolationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TypeViolation getTypeViolationSample1() {
        return new TypeViolation().id(1L).violationName("violationName1");
    }

    public static TypeViolation getTypeViolationSample2() {
        return new TypeViolation().id(2L).violationName("violationName2");
    }

    public static TypeViolation getTypeViolationRandomSampleGenerator() {
        return new TypeViolation().id(longCount.incrementAndGet()).violationName(UUID.randomUUID().toString());
    }
}
