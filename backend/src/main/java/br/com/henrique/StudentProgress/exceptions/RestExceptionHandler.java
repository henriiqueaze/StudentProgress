package br.com.henrique.StudentProgress.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

import br.com.henrique.StudentProgress.exceptions.InvalidCredentialsException;
import br.com.henrique.StudentProgress.exceptions.UserAlreadyExistsException;

@ControllerAdvice
public class RestExceptionHandler {
    //@ExceptionHandler(Exception.class)
    //private ResponseEntity<RestErrorMessage> exceptionHandler(Exception exception, HttpServletRequest request) {
      //  RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", "An unexpected error occurred. Please try again later.", request.getRequestURI());
        //return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(threatMessage);
    //}

    @ExceptionHandler(IdNotFoundException.class)
    private ResponseEntity<RestErrorMessage> handleIdNotFoundException(IdNotFoundException exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.NOT_FOUND, "Student not found", "Id not found", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(threatMessage);
    }

    @ExceptionHandler(InvalidGradeException.class)
    private ResponseEntity<RestErrorMessage> handleInvalidGradeException(InvalidGradeException exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.BAD_REQUEST, "Invalid grade", "Grade must be between 0 and 10.", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(threatMessage);
    }

    @ExceptionHandler(MissingRequiredFieldException.class)
    private ResponseEntity<RestErrorMessage> handleMissingRequiredFieldException(MissingRequiredFieldException exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.BAD_REQUEST, "Missing required fields", "Mandatory fields are missing", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(threatMessage);
    }

    @ExceptionHandler(InvalidStatusExcepetion.class)
    private ResponseEntity<RestErrorMessage> handleInvalidStatusException(InvalidStatusExcepetion exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.BAD_REQUEST, "Invalid Status", "The provided status is invalid or null", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(threatMessage);
    }

    @ExceptionHandler({InvalidCredentialsException.class, BadCredentialsException.class})
    private ResponseEntity<RestErrorMessage> handleInvalidCredentialsException(RuntimeException exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.UNAUTHORIZED, "Invalid credentials", exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(threatMessage);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    private ResponseEntity<RestErrorMessage> handleUserAlreadyExistsException(UserAlreadyExistsException exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.CONFLICT, "User already exists", exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(threatMessage);
    }
}
