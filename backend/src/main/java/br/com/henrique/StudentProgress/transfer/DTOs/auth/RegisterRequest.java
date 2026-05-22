package br.com.henrique.StudentProgress.transfer.DTOs.auth;

public record RegisterRequest(String name, String email, String password) {
}