package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A CCCD.
 */
@Entity
@Table(name = "cccd")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CCCD implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "date_birth")
    private Instant dateBirth;

    @Column(name = "sex")
    private String sex;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "place_origin")
    private String placeOrigin;

    @Column(name = "place_residence")
    private String placeResidence;

    @Column(name = "date_issue")
    private Instant dateIssue;

    @Column(name = "date_expiry")
    private Instant dateExpiry;

    @Column(name = "personal_identification")
    private String personalIdentification;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "violations", "cCCDS" }, allowSetters = true)
    private VehicleRegistrations vehicleRegistrations;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CCCD id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return this.fullName;
    }

    public CCCD fullName(String fullName) {
        this.setFullName(fullName);
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Instant getDateBirth() {
        return this.dateBirth;
    }

    public CCCD dateBirth(Instant dateBirth) {
        this.setDateBirth(dateBirth);
        return this;
    }

    public void setDateBirth(Instant dateBirth) {
        this.dateBirth = dateBirth;
    }

    public String getSex() {
        return this.sex;
    }

    public CCCD sex(String sex) {
        this.setSex(sex);
        return this;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getNationality() {
        return this.nationality;
    }

    public CCCD nationality(String nationality) {
        this.setNationality(nationality);
        return this;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getPlaceOrigin() {
        return this.placeOrigin;
    }

    public CCCD placeOrigin(String placeOrigin) {
        this.setPlaceOrigin(placeOrigin);
        return this;
    }

    public void setPlaceOrigin(String placeOrigin) {
        this.placeOrigin = placeOrigin;
    }

    public String getPlaceResidence() {
        return this.placeResidence;
    }

    public CCCD placeResidence(String placeResidence) {
        this.setPlaceResidence(placeResidence);
        return this;
    }

    public void setPlaceResidence(String placeResidence) {
        this.placeResidence = placeResidence;
    }

    public Instant getDateIssue() {
        return this.dateIssue;
    }

    public CCCD dateIssue(Instant dateIssue) {
        this.setDateIssue(dateIssue);
        return this;
    }

    public void setDateIssue(Instant dateIssue) {
        this.dateIssue = dateIssue;
    }

    public Instant getDateExpiry() {
        return this.dateExpiry;
    }

    public CCCD dateExpiry(Instant dateExpiry) {
        this.setDateExpiry(dateExpiry);
        return this;
    }

    public void setDateExpiry(Instant dateExpiry) {
        this.dateExpiry = dateExpiry;
    }

    public String getPersonalIdentification() {
        return this.personalIdentification;
    }

    public CCCD personalIdentification(String personalIdentification) {
        this.setPersonalIdentification(personalIdentification);
        return this;
    }

    public void setPersonalIdentification(String personalIdentification) {
        this.personalIdentification = personalIdentification;
    }

    public VehicleRegistrations getVehicleRegistrations() {
        return this.vehicleRegistrations;
    }

    public void setVehicleRegistrations(VehicleRegistrations vehicleRegistrations) {
        this.vehicleRegistrations = vehicleRegistrations;
    }

    public CCCD vehicleRegistrations(VehicleRegistrations vehicleRegistrations) {
        this.setVehicleRegistrations(vehicleRegistrations);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CCCD)) {
            return false;
        }
        return getId() != null && getId().equals(((CCCD) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CCCD{" +
            "id=" + getId() +
            ", fullName='" + getFullName() + "'" +
            ", dateBirth='" + getDateBirth() + "'" +
            ", sex='" + getSex() + "'" +
            ", nationality='" + getNationality() + "'" +
            ", placeOrigin='" + getPlaceOrigin() + "'" +
            ", placeResidence='" + getPlaceResidence() + "'" +
            ", dateIssue='" + getDateIssue() + "'" +
            ", dateExpiry='" + getDateExpiry() + "'" +
            ", personalIdentification='" + getPersonalIdentification() + "'" +
            "}";
    }
}
