package br.com.henrique.StudentProgress.model.entities;

import br.com.henrique.StudentProgress.serialization.converter.NotesConverter;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "birth_date", nullable = false)
    private Date birthDate;

    @Column(name = "cpf", nullable = true)
    private String cpf;

    @Column(name = "email", nullable = true)
    private String email;

    @Column(name = "registration", nullable = false)
    private String registration;

    @Column(name = "course", nullable = false)
    private String course;

    @Column(name = "class", nullable = false)
    private String classSchool;

    @Column(name = "notes", nullable = false, columnDefinition = "TEXT")
    @Convert(converter = NotesConverter.class)
    private List<Double> notes;

    public Student() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getClassSchool() {
        return classSchool;
    }

    public void setClassSchool(String classSchool) {
        this.classSchool = classSchool;
    }

    public List<Double> getNotes() {
        return notes;
    }

    public void setNotes(List<Double> notes) {
        this.notes = notes;
    }
}
