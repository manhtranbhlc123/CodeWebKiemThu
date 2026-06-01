package com.example.FujiFruit.DTO;

public class RevenueDTO {
    private String totalRevenue;
    private String startDate;
    private String endDate;
    private long orderCount;
    private String averageOrderValue;
    private String revenueChange;

    public RevenueDTO(String totalRevenue, String startDate, String endDate, long orderCount, String averageOrderValue, String revenueChange) {
        this.totalRevenue = totalRevenue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.orderCount = orderCount;
        this.averageOrderValue = averageOrderValue;
        this.revenueChange = revenueChange;
    }

    public String getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(String totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(long orderCount) {
        this.orderCount = orderCount;
    }

    public String getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(String averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public String getRevenueChange() {
        return revenueChange;
    }

    public void setRevenueChange(String revenueChange) {
        this.revenueChange = revenueChange;
    }
}