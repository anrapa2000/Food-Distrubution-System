package com.foodmatch.matchingservice.listener;

import com.foodmatch.matchingservice.model.DonationEvent;
import com.foodmatch.matchingservice.model.MatchedDonation;
import com.foodmatch.matchingservice.model.Ngo;
import com.foodmatch.matchingservice.repository.MatchedDonationRepository;
import com.foodmatch.matchingservice.service.MatchingService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class DonationEventListener {

    private final MatchingService matchingService;
    private final MatchedDonationRepository matchedDonationRepo;

    public DonationEventListener(MatchingService matchingService, MatchedDonationRepository matchedDonationRepo) {
        this.matchingService = matchingService;
        this.matchedDonationRepo = matchedDonationRepo;
    }

    @KafkaListener(
        topics = "donation.events",
        groupId = "matching-service-group",
        containerFactory = "donationKafkaListenerContainerFactory"
    )
    public void handleDonation(DonationEvent event) {
        System.out.printf("📥 Received donation event: %s from donor %s at location (%.3f, %.3f)%n",
                event.getDonationId(), event.getDonorId(), event.getLat(), event.getLon());

        Ngo matchedNgo = matchingService.findNearestNgo(event);

        if (matchedNgo != null) {
            System.out.printf("✅ Matched with NGO: %s (%s)%n", matchedNgo.getName(), matchedNgo.getId());

            MatchedDonation match = new MatchedDonation();
            match.setDonationId(event.getDonationId());
            match.setDonorId(event.getDonorId());
            match.setLat(event.getLat());
            match.setLon(event.getLon());
            match.setQuantity(event.getQuantity());
            match.setTimestamp(event.getTimestamp());
            match.setNgoId(matchedNgo.getId());
            match.setNgoName(matchedNgo.getName());
            match.setNgoLat(matchedNgo.getLat());
            match.setNgoLon(matchedNgo.getLon());

            matchedDonationRepo.save(match);
        } else {
            System.out.println("⚠️ No nearby NGO found for this donation.");
        }
    }
}
