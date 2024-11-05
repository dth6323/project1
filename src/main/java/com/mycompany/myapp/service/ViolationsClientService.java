package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Violations;
import com.mycompany.myapp.repository.ViolationsRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ViolationsClientService {

    private ViolationsRepository violationsRepository;

    public ViolationsClientService(ViolationsRepository violationsRepository) {
        this.violationsRepository = violationsRepository;
    }

    public List<Violations> searchByLicensePlate(String licensePlate) {
        return violationsRepository.findByVehicleLicensePlate(licensePlate);
    }
}
