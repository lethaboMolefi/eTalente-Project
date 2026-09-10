package com.enviro.assessment.junior.lethabo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioResponseDto {
    private String investorName;
    private Integer investorAge;
    private BigDecimal totalBalance;
    private List<ProductDto> products;
    private List<WithdrawalResponseDto> withdrawalHistory;
}
