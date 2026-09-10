package com.enviro.assessment.junior.lethabo.service;

import com.enviro.assessment.junior.lethabo.dto.PortfolioResponseDto;
import com.enviro.assessment.junior.lethabo.dto.ProductDto;
import com.enviro.assessment.junior.lethabo.dto.WithdrawalResponseDto;
import com.enviro.assessment.junior.lethabo.entity.Investor;
import com.enviro.assessment.junior.lethabo.repository.InvestorRepository;
import com.enviro.assessment.junior.lethabo.repository.WithdrawalNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioService {

    private final InvestorRepository investorRepository;
    private final WithdrawalNoticeRepository withdrawalNoticeRepository;

    public PortfolioResponseDto getPortfolioDetails(Long investorId) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new RuntimeException("Investor not found"));

        List<ProductDto> productDtos = investor.getProducts().stream()
                .map(p -> new ProductDto(p.getId(), p.getName(), p.getType(), p.getBalance(), p.getInitialInvestment()))
                .collect(Collectors.toList());

        BigDecimal totalBalance = investor.getProducts().stream()
                .map(p -> p.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<WithdrawalResponseDto> withdrawalDtos = withdrawalNoticeRepository.findAll().stream()
                .filter(w -> w.getProduct().getInvestor().getId().equals(investorId))
                .map(w -> new WithdrawalResponseDto(
                        w.getId(), 
                        w.getWithdrawalDate().toString(), 
                        w.getProduct().getName(), 
                        w.getAmount(), 
                        w.getStatus()))
                .collect(Collectors.toList());

        return new PortfolioResponseDto(
                investor.getName(),
                investor.getAge(),
                totalBalance,
                productDtos,
                withdrawalDtos
        );
    }
}
