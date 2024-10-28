package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CCCDTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CCCD getCCCDSample1() {
        return new CCCD()
            .id(1L)
            .fullName("fullName1")
            .sex("sex1")
            .nationality("nationality1")
            .placeOrigin("placeOrigin1")
            .placeResidence("placeResidence1")
            .personalIdentification("personalIdentification1");
    }

    public static CCCD getCCCDSample2() {
        return new CCCD()
            .id(2L)
            .fullName("fullName2")
            .sex("sex2")
            .nationality("nationality2")
            .placeOrigin("placeOrigin2")
            .placeResidence("placeResidence2")
            .personalIdentification("personalIdentification2");
    }

    public static CCCD getCCCDRandomSampleGenerator() {
        return new CCCD()
            .id(longCount.incrementAndGet())
            .fullName(UUID.randomUUID().toString())
            .sex(UUID.randomUUID().toString())
            .nationality(UUID.randomUUID().toString())
            .placeOrigin(UUID.randomUUID().toString())
            .placeResidence(UUID.randomUUID().toString())
            .personalIdentification(UUID.randomUUID().toString());
    }
}
