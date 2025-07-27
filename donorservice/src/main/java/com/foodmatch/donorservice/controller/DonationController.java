package com.foodmatch.donorservice.controller;

import com.foodmatch.donorservice.model.Donation;
import com.foodmatch.donorservice.service.DonationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/donations")
public class DonationController {

    private final DonationService service;

    public DonationController(DonationService service) {
        this.service = service;
    }

    @PostMapping
    public Donation createDonation(@RequestBody Donation donation) {
        return service.saveDonation(donation);
    }
}
