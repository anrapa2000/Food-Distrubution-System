package com.foodmatch.matchingservice.controller;

import com.foodmatch.matchingservice.service.NgoCacheService;
import com.foodmatch.matchingservice.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cache")
public class CacheController {

    @Autowired
    private NgoCacheService ngoCacheService;

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getCacheStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("cacheEnabled", ngoCacheService.isCacheEnabled());
        status.put("cacheSize", ngoCacheService.getCacheSize());
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCache() {
        ngoCacheService.clearNgoCache();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cache cleared successfully");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear/location")
    public ResponseEntity<Map<String, String>> clearLocationCache(
            @RequestParam double lat, 
            @RequestParam double lon) {
        ngoCacheService.clearLocationCache(lat, lon);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Location cache cleared");
        response.put("location", lat + ":" + lon);
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("cacheEnabled", ngoCacheService.isCacheEnabled());
        stats.put("cacheSize", ngoCacheService.getCacheSize());
        stats.put("totalNgos", matchingService.getAllNgos().size());
        stats.put("memoryUsage", Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory());
        stats.put("maxMemory", Runtime.getRuntime().maxMemory());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/warm")
    public ResponseEntity<Map<String, String>> warmCache() {
        // Pre-populate cache with common locations
        double[] commonLats = {12.9716, 12.920, 13.000, 12.933};
        double[] commonLons = {77.5946, 77.600, 77.700, 77.610};
        
        for (int i = 0; i < commonLats.length; i++) {
            matchingService.findNearestNgo(null); // This will trigger cache population
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cache warmed with common locations");
        response.put("locationsWarmed", String.valueOf(commonLats.length));
        return ResponseEntity.ok(response);
    }
} 