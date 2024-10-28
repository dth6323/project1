package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Violations.
 */
@Entity
@Table(name = "violations")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Violations implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "violation_time")
    private Instant violationTime;

    @Column(name = "location")
    private String location;

    @Column(name = "status")
    private String status;

    @Column(name = "evidence_image")
    private String evidenceImage;

    @Column(name = "created_at")
    private Instant createdAt;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "violations")
    @JsonIgnoreProperties(value = { "violations" }, allowSetters = true)
    private Set<TypeViolation> typeViolations = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "violations")
    @JsonIgnoreProperties(value = { "violations", "cCCDS" }, allowSetters = true)
    private Set<VehicleRegistrations> vehicleRegistrations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Violations id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getViolationTime() {
        return this.violationTime;
    }

    public Violations violationTime(Instant violationTime) {
        this.setViolationTime(violationTime);
        return this;
    }

    public void setViolationTime(Instant violationTime) {
        this.violationTime = violationTime;
    }

    public String getLocation() {
        return this.location;
    }

    public Violations location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return this.status;
    }

    public Violations status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEvidenceImage() {
        return this.evidenceImage;
    }

    public Violations evidenceImage(String evidenceImage) {
        this.setEvidenceImage(evidenceImage);
        return this;
    }

    public void setEvidenceImage(String evidenceImage) {
        this.evidenceImage = evidenceImage;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Violations createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Set<TypeViolation> getTypeViolations() {
        return this.typeViolations;
    }

    public void setTypeViolations(Set<TypeViolation> typeViolations) {
        if (this.typeViolations != null) {
            this.typeViolations.forEach(i -> i.setViolations(null));
        }
        if (typeViolations != null) {
            typeViolations.forEach(i -> i.setViolations(this));
        }
        this.typeViolations = typeViolations;
    }

    public Violations typeViolations(Set<TypeViolation> typeViolations) {
        this.setTypeViolations(typeViolations);
        return this;
    }

    public Violations addTypeViolation(TypeViolation typeViolation) {
        this.typeViolations.add(typeViolation);
        typeViolation.setViolations(this);
        return this;
    }

    public Violations removeTypeViolation(TypeViolation typeViolation) {
        this.typeViolations.remove(typeViolation);
        typeViolation.setViolations(null);
        return this;
    }

    public Set<VehicleRegistrations> getVehicleRegistrations() {
        return this.vehicleRegistrations;
    }

    public void setVehicleRegistrations(Set<VehicleRegistrations> vehicleRegistrations) {
        if (this.vehicleRegistrations != null) {
            this.vehicleRegistrations.forEach(i -> i.removeViolations(this));
        }
        if (vehicleRegistrations != null) {
            vehicleRegistrations.forEach(i -> i.addViolations(this));
        }
        this.vehicleRegistrations = vehicleRegistrations;
    }

    public Violations vehicleRegistrations(Set<VehicleRegistrations> vehicleRegistrations) {
        this.setVehicleRegistrations(vehicleRegistrations);
        return this;
    }

    public Violations addVehicleRegistrations(VehicleRegistrations vehicleRegistrations) {
        this.vehicleRegistrations.add(vehicleRegistrations);
        vehicleRegistrations.getViolations().add(this);
        return this;
    }

    public Violations removeVehicleRegistrations(VehicleRegistrations vehicleRegistrations) {
        this.vehicleRegistrations.remove(vehicleRegistrations);
        vehicleRegistrations.getViolations().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Violations)) {
            return false;
        }
        return getId() != null && getId().equals(((Violations) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Violations{" +
            "id=" + getId() +
            ", violationTime='" + getViolationTime() + "'" +
            ", location='" + getLocation() + "'" +
            ", status='" + getStatus() + "'" +
            ", evidenceImage='" + getEvidenceImage() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
