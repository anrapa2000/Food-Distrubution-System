package com.foodmatch.matchingservice.model;

import java.io.Serializable;

public class Ngo implements Serializable {
    private String id;
    private String name;
    private double lat;
    private double lon;
    private String address;
    private String phone;
    private String email;
    private String category;
    private boolean active;
    private int capacity;
    private double rating;

    public Ngo() {}

    public Ngo(String id, String name, double lat, double lon, String address) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.address = address;
        this.active = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLon() { return lon; }
    public void setLon(double lon) { this.lon = lon; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    // Calculate distance to another point using Haversine formula
    public double distanceTo(double lat, double lon) {
        final int R = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat - this.lat);
        double lonDistance = Math.toRadians(lon - this.lon);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(this.lat)) * Math.cos(Math.toRadians(lat))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    @Override
    public String toString() {
        return "Ngo{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", lat=" + lat +
                ", lon=" + lon +
                ", address='" + address + '\'' +
                ", active=" + active +
                '}';
    }
}
