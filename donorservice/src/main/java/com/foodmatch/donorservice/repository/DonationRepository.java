package com.foodmatch.donorservice.repository;

import com.foodmatch.donorservice.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DonationRepository extends MongoRepository<Donation, String> {
}
