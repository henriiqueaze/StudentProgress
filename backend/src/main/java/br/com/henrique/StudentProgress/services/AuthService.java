package br.com.henrique.StudentProgress.services;

import br.com.henrique.StudentProgress.exceptions.InvalidCredentialsException;
import br.com.henrique.StudentProgress.exceptions.MissingRequiredFieldException;
import br.com.henrique.StudentProgress.exceptions.UserAlreadyExistsException;
import br.com.henrique.StudentProgress.infra.repositories.AppUserRepository;
import br.com.henrique.StudentProgress.model.entities.AppUser;
import br.com.henrique.StudentProgress.transfer.DTOs.auth.AuthResponse;
import br.com.henrique.StudentProgress.transfer.DTOs.auth.AuthUserResponse;
import br.com.henrique.StudentProgress.transfer.DTOs.auth.LoginRequest;
import br.com.henrique.StudentProgress.transfer.DTOs.auth.RegisterRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository repository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRequest(request.name(), request.email(), request.password());

        String email = request.email().trim().toLowerCase();
        if (repository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email já cadastrado.");
        }

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("USER");

        repository.save(user);

        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        validateRequest("login", request.email(), request.password());

        String email = request.email().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (Exception exception) {
            throw new InvalidCredentialsException("Email ou senha inválidos.");
        }

        AppUser user = repository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Email ou senha inválidos."));

        return buildResponse(user);
    }

    private AuthResponse buildResponse(AppUser user) {
        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, "Bearer", new AuthUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()));
    }

    private void validateRequest(String name, String email, String password) {
        if (name == null || email == null || password == null
                || name.isBlank() || email.isBlank() || password.isBlank()) {
            throw new MissingRequiredFieldException("Mandatory fields are missing");
        }
    }
}