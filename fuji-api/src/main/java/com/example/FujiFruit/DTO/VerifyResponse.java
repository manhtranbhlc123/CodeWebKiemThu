package com.example.FujiFruit.DTO;


import lombok.Data;

import java.util.List;

@Data
public class VerifyResponse {
    private String username;
    private List<String> roles;

    public VerifyResponse(String username, List<String> roles) {
        this.username = username;
        this.roles = roles;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}