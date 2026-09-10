package com.enviro.assessment.junior.lethabo.repository;

import com.enviro.assessment.junior.lethabo.entity.WithdrawalNotice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalNoticeRepository extends JpaRepository<WithdrawalNotice, Long> {
}
