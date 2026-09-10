package com.enviro.assessment.junior.lethabo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalResponseDto {
    private Long id;
    private String date;
    private String product;
    private BigDecimal amount;
    private String status;
}
