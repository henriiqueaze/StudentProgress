package br.com.henrique.StudentProgress.exceptions;

public class InvalidGradeException extends RuntimeException {
    public InvalidGradeException(String message) {
        super(message);
    }
}
