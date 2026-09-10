package com.enviro.assessment.junior.lethabo.service;

import com.enviro.assessment.junior.lethabo.dto.WithdrawalRequestDto;
import com.enviro.assessment.junior.lethabo.entity.Investor;
import com.enviro.assessment.junior.lethabo.entity.Product;
import com.enviro.assessment.junior.lethabo.exception.BusinessRuleException;
import com.enviro.assessment.junior.lethabo.repository.ProductRepository;
import com.enviro.assessment.junior.lethabo.repository.WithdrawalNoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WithdrawalServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private WithdrawalNoticeRepository withdrawalNoticeRepository;

    @InjectMocks
    private WithdrawalService withdrawalService;

    private Investor validInvestor;
    private Investor underageInvestor;
    private Product retirementProduct;
    private Product savingsProduct;

    @BeforeEach
    void setUp() {
        validInvestor = new Investor();
        validInvestor.setId(1L);
        validInvestor.setAge(68);

        underageInvestor = new Investor();
        underageInvestor.setId(2L);
        underageInvestor.setAge(50);

        retirementProduct = new Product();
        retirementProduct.setId(1L);
        retirementProduct.setType("RETIREMENT");
        retirementProduct.setBalance(new BigDecimal("100000.00"));
        retirementProduct.setInvestor(validInvestor);

        savingsProduct = new Product();
        savingsProduct.setId(2L);
        savingsProduct.setType("SAVINGS");
        savingsProduct.setBalance(new BigDecimal("25000.00"));
        savingsProduct.setInvestor(underageInvestor);
    }

    @Test
    void whenRetirementAndAgeUnder65_thenThrowException() {
        retirementProduct.setInvestor(underageInvestor);
        when(productRepository.findById(1L)).thenReturn(Optional.of(retirementProduct));

        WithdrawalRequestDto request = new WithdrawalRequestDto(1L, new BigDecimal("1000.00"));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, 
            () -> withdrawalService.processWithdrawal(request));

        assertEquals("Retirement withdrawals only allowed if age > 65.", exception.getMessage());
    }

    @Test
    void whenAmountExceedsBalance_thenThrowException() {
        when(productRepository.findById(2L)).thenReturn(Optional.of(savingsProduct));

        WithdrawalRequestDto request = new WithdrawalRequestDto(2L, new BigDecimal("30000.00"));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, 
            () -> withdrawalService.processWithdrawal(request));

        assertEquals("Withdrawal must not exceed balance.", exception.getMessage());
    }

    @Test
    void whenAmountExceeds90PercentOfBalance_thenThrowException() {
        when(productRepository.findById(2L)).thenReturn(Optional.of(savingsProduct));

        // 90% of 25000 is 22500. Requesting 23000 should fail.
        WithdrawalRequestDto request = new WithdrawalRequestDto(2L, new BigDecimal("23000.00"));

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, 
            () -> withdrawalService.processWithdrawal(request));

        assertEquals("Withdrawal must not exceed 90% of balance.", exception.getMessage());
    }
}
