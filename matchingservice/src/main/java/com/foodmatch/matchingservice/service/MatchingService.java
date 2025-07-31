package com.foodmatch.matchingservice.service;

import com.foodmatch.matchingservice.model.DonationEvent;
import com.foodmatch.matchingservice.model.Ngo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private NgoCacheService ngoCacheService;

    private final List<Ngo> ngoList = Arrays.asList(
            new Ngo("ngo001", "Helping Hands", 12.933, 77.610, "Koramangala, Bangalore"),
            new Ngo("ngo002", "Food For All", 12.920, 77.600, "Indiranagar, Bangalore"),
            new Ngo("ngo003", "Kindness Kitchen", 13.000, 77.700, "HSR Layout, Bangalore")
    );

    @Cacheable(value = "ngoLocation", key = "#event.lat + ':' + #event.lon")
    public Ngo findNearestNgo(DonationEvent event) {
        // Check cache first
        String cacheKey = ngoCacheService.generateLocationKey(event.getLat(), event.getLon());
        Ngo cachedNgo = ngoCacheService.getCachedNgoLocation(cacheKey);
        
        if (cachedNgo != null) {
            return cachedNgo;
        }

        // Find nearest NGO
        Ngo nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (Ngo ngo : ngoList) {
            double distance = haversine(event.getLat(), event.getLon(), ngo.getLat(), ngo.getLon());
            if (distance < 5.0 && distance < minDistance) {
                nearest = ngo;
                minDistance = distance;
            }
        }

        // Cache the result
        if (nearest != null) {
            ngoCacheService.cacheNgoLocation(cacheKey, nearest);
        }

        return nearest;
    }

    @Cacheable(value = "ngoList", key = "#lat + ':' + #lon + ':range'")
    public List<Ngo> findNgosInRange(double lat, double lon, double rangeKm) {
        return ngoList.stream()
                .filter(ngo -> haversine(lat, lon, ngo.getLat(), ngo.getLon()) <= rangeKm)
                .collect(Collectors.toList());
    }

    public List<Ngo> getAllNgos() {
        return ngoList;
    }

    public void clearCache() {
        ngoCacheService.clearNgoCache();
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}
