package com.enviro.assessment.junior.lethabo.controller;

import com.enviro.assessment.junior.lethabo.dto.WithdrawalRequestDto;
import com.enviro.assessment.junior.lethabo.dto.WithdrawalResponseDto;
import com.enviro.assessment.junior.lethabo.service.WithdrawalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/withdrawals")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    @PostMapping
    public ResponseEntity<WithdrawalResponseDto> processWithdrawal(@Valid @RequestBody WithdrawalRequestDto request) {
        return ResponseEntity.ok(withdrawalService.processWithdrawal(request));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportWithdrawals(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        // Hardcoding investor ID 1 for prototype
        String csv = withdrawalService.generateCsv(1L, fromDate, toDate);
        byte[] bytes = csv.getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "withdrawals.csv");
        headers.setContentLength(bytes.length);
        
        return ResponseEntity.ok().headers(headers).body(bytes);
    }
}
