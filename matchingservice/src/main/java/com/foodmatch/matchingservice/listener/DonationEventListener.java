package com.foodmatch.matchingservice.listener;

import com.foodmatch.matchingservice.model.DonationEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class DonationEventListener {

    @KafkaListener(topics = "donation.events", groupId = "matching-service-group", containerFactory = "donationKafkaListenerContainerFactory")
    public void handleDonationEvent(DonationEvent event) {
        System.out.printf("📥 Received donation event: %s from donor %s at location (%.3f, %.3f)%n",
                event.getDonationId(), event.getDonorId(), event.getLat(), event.getLon());
    }
}
