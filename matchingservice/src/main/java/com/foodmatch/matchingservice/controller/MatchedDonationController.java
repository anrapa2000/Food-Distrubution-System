package com.foodmatch.matchingservice.controller;

import com.foodmatch.matchingservice.model.MatchedDonation;
import com.foodmatch.matchingservice.repository.MatchedDonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/matches")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class MatchedDonationController {

    @Autowired
    private MatchedDonationRepository repository;

    // GET /matches → return all matched donations
    @GetMapping
    public ResponseEntity<List<MatchedDonation>> getAllMatches() {
        try {
            List<MatchedDonation> matches = repository.findAll();
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            System.err.println("Error fetching all matches: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET /matches/{donorId} → return matches by donor
    @GetMapping("/{donorId}")
    public ResponseEntity<List<MatchedDonation>> getMatchesByDonor(@PathVariable String donorId) {
        try {
            List<MatchedDonation> matches = repository.findByDonorId(donorId);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            System.err.println("Error fetching matches for donor " + donorId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // DELETE /matches/clear → clear all matches (for testing)
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearAllMatches() {
        try {
            repository.deleteAll();
            return ResponseEntity.ok("All matches cleared successfully");
        } catch (Exception e) {
            System.err.println("Error clearing matches: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to clear matches");
        }
    }

    // PUT /matches/{donationId} → update a specific match
    @PutMapping("/{donationId}")
    public ResponseEntity<MatchedDonation> updateMatch(@PathVariable String donationId, @RequestBody MatchedDonation updateRequest) {
        try {
            Optional<MatchedDonation> existingOpt = repository.findById(donationId);
            if (existingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            MatchedDonation existing = existingOpt.get();
            existing.setQuantity(updateRequest.getQuantity());
            existing.setNgoName(updateRequest.getNgoName());
            
            MatchedDonation saved = repository.save(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error updating match " + donationId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // DELETE /matches/{donationId} → delete a specific match
    @DeleteMapping("/{donationId}")
    public ResponseEntity<String> deleteMatch(@PathVariable String donationId) {
        try {
            if (!repository.existsById(donationId)) {
                return ResponseEntity.notFound().build();
            }
            repository.deleteById(donationId);
            return ResponseEntity.ok("Match deleted successfully");
        } catch (Exception e) {
            System.err.println("Error deleting match " + donationId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to delete match");
        }
    }

    // GET /matches/health → health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        try {
            long count = repository.count();
            return ResponseEntity.ok("Service is healthy. Total matches: " + count);
        } catch (Exception e) {
            System.err.println("Health check failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Service is unhealthy: " + e.getMessage());
        }
    }
}
