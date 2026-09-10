package com.enviro.assessment.junior.lethabo.repository;

import com.enviro.assessment.junior.lethabo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
