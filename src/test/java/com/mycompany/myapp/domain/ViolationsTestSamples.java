package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ViolationsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Violations getViolationsSample1() {
        return new Violations().id(1L).location("location1").status("status1").evidenceImage("evidenceImage1");
    }

    public static Violations getViolationsSample2() {
        return new Violations().id(2L).location("location2").status("status2").evidenceImage("evidenceImage2");
    }

    public static Violations getViolationsRandomSampleGenerator() {
        return new Violations()
            .id(longCount.incrementAndGet())
            .location(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .evidenceImage(UUID.randomUUID().toString());
    }
}
