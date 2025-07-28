package com.foodmatch.matchingservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "matched_donations")
public class MatchedDonation {

    @Id
    private String donationId;

    private String donorId;
    private String ngoId;
    private String ngoName;
    private double lat;
    private double lon;
    private int quantity;
    private String timestamp;

    @Column
    private Double ngoLat;

    @Column
    private Double ngoLon;

    // Getters and Setters

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

    public String getDonorId() {
        return donorId;
    }

    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }

    public String getNgoId() {
        return ngoId;
    }

    public void setNgoId(String ngoId) {
        this.ngoId = ngoId;
    }

    public String getNgoName() {
        return ngoName;
    }

    public void setNgoName(String ngoName) {
        this.ngoName = ngoName;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Double getNgoLat() {
        return ngoLat;
    }

    public void setNgoLat(Double ngoLat) {
        this.ngoLat = ngoLat;
    }

    public Double getNgoLon() {
        return ngoLon;
    }

    public void setNgoLon(Double ngoLon) {
        this.ngoLon = ngoLon;
    }
}
