package com.enviro.assessment.junior.lethabo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String type;
    private BigDecimal balance;
    private BigDecimal initialInvestment;
}
