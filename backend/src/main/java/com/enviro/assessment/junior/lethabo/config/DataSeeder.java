package com.enviro.assessment.junior.lethabo.config;

import com.enviro.assessment.junior.lethabo.entity.Investor;
import com.enviro.assessment.junior.lethabo.entity.Product;
import com.enviro.assessment.junior.lethabo.entity.WithdrawalNotice;
import com.enviro.assessment.junior.lethabo.repository.InvestorRepository;
import com.enviro.assessment.junior.lethabo.repository.ProductRepository;
import com.enviro.assessment.junior.lethabo.repository.WithdrawalNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final InvestorRepository investorRepository;
    private final ProductRepository productRepository;
    private final WithdrawalNoticeRepository withdrawalNoticeRepository;

    @Override
    public void run(String... args) throws Exception {
        if (investorRepository.count() == 0) {
            Investor investor = new Investor();
            investor.setName("John Doe");
            investor.setAge(68);
            investor.setContactDetails("john.doe@example.com");
            investor.setProducts(new ArrayList<>());
            investor = investorRepository.save(investor);

            Product retirement = new Product();
            retirement.setName("Retirement Fund");
            retirement.setType("RETIREMENT");
            retirement.setBalance(new BigDecimal("100000.00"));
            retirement.setInitialInvestment(new BigDecimal("90000.00"));
            retirement.setInvestor(investor);
            retirement = productRepository.save(retirement);

            Product savings = new Product();
            savings.setName("Standard Savings");
            savings.setType("SAVINGS");
            savings.setBalance(new BigDecimal("25000.00"));
            savings.setInitialInvestment(new BigDecimal("26000.00"));
            savings.setInvestor(investor);
            savings = productRepository.save(savings);

            WithdrawalNotice notice1 = new WithdrawalNotice();
            notice1.setAmount(new BigDecimal("5000.00"));
            notice1.setWithdrawalDate(LocalDate.of(2023, 1, 15));
            notice1.setStatus("COMPLETED");
            notice1.setProduct(retirement);
            withdrawalNoticeRepository.save(notice1);

            WithdrawalNotice notice2 = new WithdrawalNotice();
            notice2.setAmount(new BigDecimal("1000.00"));
            notice2.setWithdrawalDate(LocalDate.of(2023, 6, 20));
            notice2.setStatus("COMPLETED");
            notice2.setProduct(savings);
            withdrawalNoticeRepository.save(notice2);
        }
    }
}
