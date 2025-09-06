package com.trancongphat.facility_management.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class HmacSHA256Util {
    public static String sign(String data, String key) {
        try {
            Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
            hmacSHA256.init(secretKeySpec);
            byte[] bytes = hmacSHA256.doFinal(data.getBytes("UTF-8"));

            // Convert to hex string (lowercase)
            StringBuilder sb = new StringBuilder(2 * bytes.length);
            for (byte b : bytes) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Cannot sign request", e);
        }
    }
}
