package br.com.henrique.StudentProgress.transfer.DTOs.auth;

public record AuthUserResponse(Long id, String name, String email, String role) {
}