package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class VehicleRegistrationsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static VehicleRegistrations getVehicleRegistrationsSample1() {
        return new VehicleRegistrations()
            .id(1L)
            .vehicleNumber("vehicleNumber1")
            .ownerName("ownerName1")
            .engineNum("engineNum1")
            .chassisNum("chassisNum1")
            .vehicleType("vehicleType1")
            .brand("brand1")
            .modelCode("modelCode1")
            .color("color1")
            .capacity("capacity1")
            .issuedBy("issuedBy1");
    }

    public static VehicleRegistrations getVehicleRegistrationsSample2() {
        return new VehicleRegistrations()
            .id(2L)
            .vehicleNumber("vehicleNumber2")
            .ownerName("ownerName2")
            .engineNum("engineNum2")
            .chassisNum("chassisNum2")
            .vehicleType("vehicleType2")
            .brand("brand2")
            .modelCode("modelCode2")
            .color("color2")
            .capacity("capacity2")
            .issuedBy("issuedBy2");
    }

    public static VehicleRegistrations getVehicleRegistrationsRandomSampleGenerator() {
        return new VehicleRegistrations()
            .id(longCount.incrementAndGet())
            .vehicleNumber(UUID.randomUUID().toString())
            .ownerName(UUID.randomUUID().toString())
            .engineNum(UUID.randomUUID().toString())
            .chassisNum(UUID.randomUUID().toString())
            .vehicleType(UUID.randomUUID().toString())
            .brand(UUID.randomUUID().toString())
            .modelCode(UUID.randomUUID().toString())
            .color(UUID.randomUUID().toString())
            .capacity(UUID.randomUUID().toString())
            .issuedBy(UUID.randomUUID().toString());
    }
}
