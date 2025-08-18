package com.trancongphat.facility_management.dto;

import java.math.BigDecimal;

public class CreatePaymentRequest {
    private Integer invoiceId;
    private String method;        // "CASH" hoặc "MOMO"
    private String payerInfo;     // tên/ghi chú người trả
    private BigDecimal amount;    // số tiền client muốn trả (tùy case tiền mặt)

    public Integer getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Integer invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getPayerInfo() {
        return payerInfo;
    }

    public void setPayerInfo(String payerInfo) {
        this.payerInfo = payerInfo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}

