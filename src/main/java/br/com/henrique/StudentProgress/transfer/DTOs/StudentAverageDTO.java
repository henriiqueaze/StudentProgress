package br.com.henrique.StudentProgress.transfer.DTOs;

import br.com.henrique.StudentProgress.model.enums.StudentStatus;

import java.util.List;

public class StudentAverageDTO {
    private String studentName;
    private List<Double> notes;
    private Double average;
    private StudentStatus status;

    public StudentAverageDTO(String studentName, List<Double> notes, Double average, StudentStatus status) {
        this.studentName = studentName;
        this.notes = notes;
        this.average = average;
        this.status = status;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public List<Double> getNotes() {
        return notes;
    }

    public void setNotes(List<Double> notes) {
        this.notes = notes;
    }

    public Double getAverage() {
        return average;
    }

    public void setAverage(Double average) {
        this.average = average;
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }
}
