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
}
