package com.foodmatch.matchingservice.repository;

import com.foodmatch.matchingservice.model.MatchedDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchedDonationRepository extends JpaRepository<MatchedDonation, String> {
    List<MatchedDonation> findByDonorId(String donorId);
}
