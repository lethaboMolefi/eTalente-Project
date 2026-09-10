package com.enviro.assessment.junior.lethabo.controller;

import com.enviro.assessment.junior.lethabo.dto.PortfolioResponseDto;
import com.enviro.assessment.junior.lethabo.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/v1/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    // Hardcoding investor ID 1 for prototype purposes
    @GetMapping
    public ResponseEntity<PortfolioResponseDto> getPortfolio() {
        return ResponseEntity.ok(portfolioService.getPortfolioDetails(1L));
    }
}
