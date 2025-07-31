package com.foodmatch.matchingservice.service;

import com.foodmatch.matchingservice.model.Ngo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

@Service
public class NgoCacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String NGO_CACHE_PREFIX = "ngo:location:";
    private static final String NGO_LIST_CACHE_PREFIX = "ngo:list:";
    private static final int CACHE_TTL_MINUTES = 30;

    // Cache NGO lookup by coordinates
    @Cacheable(value = "ngoLocation", key = "#lat + ':' + #lon")
    public Ngo findNearestNgo(double lat, double lon) {
        // This method will be cached automatically
        // The actual implementation will be in MatchingService
        return null; // Placeholder - actual logic in MatchingService
    }

    // Cache list of NGOs by location range
    @Cacheable(value = "ngoList", key = "#lat + ':' + #lon + ':range'")
    public List<Ngo> findNgosInRange(double lat, double lon, double rangeKm) {
        // This method will be cached automatically
        return new ArrayList<>(); // Placeholder
    }

    // Manual cache management for custom keys
    public void cacheNgoLocation(String key, Ngo ngo) {
        String cacheKey = NGO_CACHE_PREFIX + key;
        redisTemplate.opsForValue().set(cacheKey, ngo, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
    }

    public Ngo getCachedNgoLocation(String key) {
        String cacheKey = NGO_CACHE_PREFIX + key;
        return (Ngo) redisTemplate.opsForValue().get(cacheKey);
    }

    public void cacheNgoList(String key, List<Ngo> ngos) {
        String cacheKey = NGO_LIST_CACHE_PREFIX + key;
        redisTemplate.opsForValue().set(cacheKey, ngos, CACHE_TTL_MINUTES, TimeUnit.MINUTES);
    }

    @SuppressWarnings("unchecked")
    public List<Ngo> getCachedNgoList(String key) {
        String cacheKey = NGO_LIST_CACHE_PREFIX + key;
        return (List<Ngo>) redisTemplate.opsForValue().get(cacheKey);
    }

    public void clearNgoCache() {
        // Clear all NGO-related cache entries
        redisTemplate.delete(redisTemplate.keys(NGO_CACHE_PREFIX + "*"));
        redisTemplate.delete(redisTemplate.keys(NGO_LIST_CACHE_PREFIX + "*"));
    }

    public void clearLocationCache(double lat, double lon) {
        String key = lat + ":" + lon;
        redisTemplate.delete(NGO_CACHE_PREFIX + key);
        redisTemplate.delete(NGO_LIST_CACHE_PREFIX + key + ":range");
    }

    // Generate cache key for location-based lookup
    public String generateLocationKey(double lat, double lon) {
        // Round coordinates to reduce cache keys (0.01 degree ≈ 1.1 km)
        double roundedLat = Math.round(lat * 100.0) / 100.0;
        double roundedLon = Math.round(lon * 100.0) / 100.0;
        return roundedLat + ":" + roundedLon;
    }

    // Cache statistics
    public long getCacheSize() {
        return redisTemplate.keys(NGO_CACHE_PREFIX + "*").size() + 
               redisTemplate.keys(NGO_LIST_CACHE_PREFIX + "*").size();
    }

    public boolean isCacheEnabled() {
        try {
            redisTemplate.getConnectionFactory().getConnection().ping();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
} 