package com.foodmatch.donorservice.service;

import com.foodmatch.donorservice.model.Donation;
import com.foodmatch.donorservice.model.DonationEvent;
import com.foodmatch.donorservice.repository.DonationRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class DonationService {

    private final DonationRepository repo;
    private final KafkaTemplate<String, DonationEvent> kafkaTemplate;

    public DonationService(DonationRepository repo, KafkaTemplate<String, DonationEvent> kafkaTemplate) {
        this.repo = repo;
        this.kafkaTemplate = kafkaTemplate;
    }

    public Donation saveDonation(Donation donation) {
        Donation saved = repo.save(donation);
        
        // Create DonationEvent from the saved donation
        DonationEvent event = new DonationEvent();
        event.setDonationId(saved.getId());
        event.setDonorId(saved.getDonorId());
        event.setLat(saved.getLat());
        event.setLon(saved.getLon());
        event.setQuantity(saved.getQuantity());
        event.setTimestamp(saved.getTimestamp());
        
        kafkaTemplate.send("donation.events", event);
        return saved;
    }
}
