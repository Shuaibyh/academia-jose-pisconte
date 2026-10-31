package com.academia.demo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(nullable = false, unique = true, length = 40)
    private String documentNumber;

    @Column(length = 120)
    private String guardianName;

    @Column(length = 40)
    private String guardianPhone;

    @Column(length = 60)
    private String guardianRelationship;

    @Column(length = 120)
    private String secondGuardianName;

    @Column(length = 40)
    private String secondGuardianPhone;

    @Column(length = 60)
    private String secondGuardianRelationship;

    @Column(nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianPhone() {
        return guardianPhone;
    }

    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }

    public String getGuardianRelationship() {
        return guardianRelationship;
    }

    public void setGuardianRelationship(String guardianRelationship) {
        this.guardianRelationship = guardianRelationship;
    }

    public String getSecondGuardianName() {
        return secondGuardianName;
    }

    public void setSecondGuardianName(String secondGuardianName) {
        this.secondGuardianName = secondGuardianName;
    }

    public String getSecondGuardianPhone() {
        return secondGuardianPhone;
    }

    public void setSecondGuardianPhone(String secondGuardianPhone) {
        this.secondGuardianPhone = secondGuardianPhone;
    }

    public String getSecondGuardianRelationship() {
        return secondGuardianRelationship;
    }

    public void setSecondGuardianRelationship(String secondGuardianRelationship) {
        this.secondGuardianRelationship = secondGuardianRelationship;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
