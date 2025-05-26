package br.com.henrique.StudentProgress.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(Exception.class)
    private ResponseEntity<RestErrorMessage> exceptionHandler(Exception exception, HttpServletRequest request) {
        RestErrorMessage threatMessage = new RestErrorMessage(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", "An unexpected error occurred. Please try again later.", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(threatMessage);
    }

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
}
