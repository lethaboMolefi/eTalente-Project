package com.enviro.assessment.junior.lethabo.service;

import com.enviro.assessment.junior.lethabo.dto.WithdrawalRequestDto;
import com.enviro.assessment.junior.lethabo.dto.WithdrawalResponseDto;
import com.enviro.assessment.junior.lethabo.entity.Product;
import com.enviro.assessment.junior.lethabo.entity.WithdrawalNotice;
import com.enviro.assessment.junior.lethabo.exception.BusinessRuleException;
import com.enviro.assessment.junior.lethabo.repository.ProductRepository;
import com.enviro.assessment.junior.lethabo.repository.WithdrawalNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WithdrawalService {

    private final ProductRepository productRepository;
    private final WithdrawalNoticeRepository withdrawalNoticeRepository;

    @Transactional
    public WithdrawalResponseDto processWithdrawal(WithdrawalRequestDto request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BusinessRuleException("Invalid product selected."));

        BigDecimal amount = request.getAmount();

        // Rule 1: Retirement product age constraint
        if ("RETIREMENT".equalsIgnoreCase(product.getType()) && product.getInvestor().getAge() <= 65) {
            throw new BusinessRuleException("Retirement withdrawals only allowed if age > 65.");
        }

        // Rule 2: Exceed balance
        if (amount.compareTo(product.getBalance()) > 0) {
            throw new BusinessRuleException("Withdrawal must not exceed balance.");
        }

        // Rule 3: Exceed 90% of balance
        BigDecimal ninetyPercent = product.getBalance().multiply(new BigDecimal("0.90"));
        if (amount.compareTo(ninetyPercent) > 0) {
            throw new BusinessRuleException("Withdrawal must not exceed 90% of balance.");
        }

        // Update balance
        product.setBalance(product.getBalance().subtract(amount));
        productRepository.save(product);

        // Create notice
        WithdrawalNotice notice = new WithdrawalNotice();
        notice.setAmount(amount);
        notice.setWithdrawalDate(LocalDate.now());
        notice.setStatus("COMPLETED");
        notice.setProduct(product);
        
        WithdrawalNotice saved = withdrawalNoticeRepository.save(notice);

        return new WithdrawalResponseDto(
                saved.getId(),
                saved.getWithdrawalDate().toString(),
                saved.getProduct().getName(),
                saved.getAmount(),
                saved.getStatus()
        );
    }
    
    @Transactional(readOnly = true)
    public String generateCsv(Long investorId, String fromDateStr, String toDateStr) {
        LocalDate fromDate = fromDateStr != null && !fromDateStr.isEmpty() ? LocalDate.parse(fromDateStr) : null;
        LocalDate toDate = toDateStr != null && !toDateStr.isEmpty() ? LocalDate.parse(toDateStr) : null;

        List<WithdrawalNotice> notices = withdrawalNoticeRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Product,Amount,Status\n");
        for (WithdrawalNotice notice : notices) {
            if (notice.getProduct().getInvestor().getId().equals(investorId)) {
                LocalDate noticeDate = notice.getWithdrawalDate();
                if (fromDate != null && noticeDate.isBefore(fromDate)) continue;
                if (toDate != null && noticeDate.isAfter(toDate)) continue;

                csv.append(noticeDate).append(",")
                   .append(notice.getProduct().getName()).append(",")
                   .append(notice.getAmount()).append(",")
                   .append(notice.getStatus()).append("\n");
            }
        }
        return csv.toString();
    }
}
