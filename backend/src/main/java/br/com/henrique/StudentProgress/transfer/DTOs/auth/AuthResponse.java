package br.com.henrique.StudentProgress.transfer.DTOs.auth;

public record AuthResponse(String token, String tokenType, AuthUserResponse user) {
}