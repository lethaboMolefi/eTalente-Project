package com.enviro.assessment.junior.lethabo.repository;

import com.enviro.assessment.junior.lethabo.entity.Investor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestorRepository extends JpaRepository<Investor, Long> {
}
