package com.trancongphat.facility_management.dto;



public class NotificationDTO {
    private String message;
    private String type; // APPROVED, REJECTED


    public NotificationDTO(String type, String message) {
        this.type = type;
        this.message = message;
    }



    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}
