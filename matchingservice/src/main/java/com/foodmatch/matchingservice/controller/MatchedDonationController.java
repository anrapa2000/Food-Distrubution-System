package com.foodmatch.matchingservice.controller;

import com.foodmatch.matchingservice.model.MatchedDonation;
import com.foodmatch.matchingservice.repository.MatchedDonationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchedDonationController {

    private final MatchedDonationRepository repository;

    public MatchedDonationController(MatchedDonationRepository repository) {
        this.repository = repository;
    }

    // GET /matches → return all matched donations
    @GetMapping
    public List<MatchedDonation> getAllMatches() {
        return repository.findAll();
    }

    // GET /matches/{donorId} → return matches by donor
    @GetMapping("/{donorId}")
    public List<MatchedDonation> getMatchesByDonor(@PathVariable String donorId) {
        return repository.findByDonorId(donorId);
    }

    // DELETE /matches/clear → clear all matches (for testing)
    @DeleteMapping("/clear")
    public void clearAllMatches() {
        repository.deleteAll();
    }

    // PUT /matches/{donationId} → update a specific match
    @PutMapping("/{donationId}")
    public MatchedDonation updateMatch(@PathVariable String donationId, @RequestBody MatchedDonation updateRequest) {
        MatchedDonation existing = repository.findById(donationId)
            .orElseThrow(() -> new RuntimeException("Match not found"));
        
        existing.setQuantity(updateRequest.getQuantity());
        existing.setNgoName(updateRequest.getNgoName());
        
        return repository.save(existing);
    }

    // DELETE /matches/{donationId} → delete a specific match
    @DeleteMapping("/{donationId}")
    public void deleteMatch(@PathVariable String donationId) {
        repository.deleteById(donationId);
    }
}
