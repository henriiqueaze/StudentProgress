package br.com.henrique.StudentProgress.services;

import br.com.henrique.StudentProgress.controllers.StudentController;
import br.com.henrique.StudentProgress.exceptions.InvalidStatusExcepetion;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.exceptions.IdNotFoundException;
import br.com.henrique.StudentProgress.exceptions.InvalidGradeException;
import br.com.henrique.StudentProgress.exceptions.MissingRequiredFieldException;
import br.com.henrique.StudentProgress.mapper.Mapper;
import br.com.henrique.StudentProgress.model.entities.Student;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.infra.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public StudentDTO findById(Long id) {
        var dto = Mapper.parseObjects(repository.findById(id).orElseThrow(() -> new IdNotFoundException("Id not found")), StudentDTO.class);
        addHateoasLinks(dto);

        return dto;
    }

    public List<StudentDTO> findAll() {
        var students = Mapper.parseListObjects(repository.findAll(), StudentDTO.class);
        students.forEach(this::addHateoasLinks);

        return students;
    }

    public StudentDTO post(StudentDTO student) {
        validateStudentFields(student);
        validateStudentNotes(student);

        var entity = Mapper.parseObjects(student, Student.class);
        repository.save(entity);

        var dto = Mapper.parseObjects(entity, StudentDTO.class);
        addHateoasLinks(dto);

        return dto;
    }

    public StudentDTO put(StudentDTO student) {
        validateStudentFields(student);
        validateStudentNotes(student);

        var entity = repository.findById(student.getId()).orElseThrow(() -> new IdNotFoundException("Id not found"));

        Mapper.mapNonNullFields(student, entity);

        repository.save(entity);

        var dto = Mapper.parseObjects(entity, StudentDTO.class);
        addHateoasLinks(dto);

        return dto;
    }

    public StudentDTO patch(Long id, StudentDTO student) {
        validateStudentNotes(student);

        var entity = repository.findById(id).orElseThrow(() -> new IdNotFoundException("Id not found"));
        Mapper.mapNonNullFields(student, entity);

        repository.save(entity);

        var dto = Mapper.parseObjects(entity, StudentDTO.class);
        addHateoasLinks(dto);

        return dto;
    }

    public void delete(Long id) {
        var entity = repository.findById(id).orElseThrow(() -> new IdNotFoundException("Id not found"));
        var dto = Mapper.parseObjects(entity, StudentDTO.class);
        addHateoasLinks(dto);

        repository.delete(entity);
    }

    public StudentAverageDTO calculateAverage(Long id) {
        var entity = repository.findById(id).orElseThrow(() -> new IdNotFoundException("Id not found"));

        if (entity.getNotes() == null || entity.getNotes().isEmpty()) {
            throw new IllegalArgumentException("Student has no grades to calculate the average");
        }

        BigDecimal sum = entity.getNotes().stream().map(BigDecimal::new).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = sum.divide(new BigDecimal(entity.getNotes().size()), 1, RoundingMode.HALF_UP);

        StudentStatus status;
        if (average.compareTo(new BigDecimal(7.0)) >= 0) {
            status = StudentStatus.APPROVED;
        }
        else if (average.compareTo(new BigDecimal(4.0)) < 0) {
            status = StudentStatus.FAILED;
        }
        else {
            status = StudentStatus.RECOVERY;
        }

        return new StudentAverageDTO(entity.getName(), entity.getNotes(), average.doubleValue(), status);
    }

    public List<StudentAverageDTO> filterByStatus(StudentStatus status) {
        if (status == null) {
            throw new InvalidStatusExcepetion("The provided status is invalid or null");
        }

        List<StudentAverageDTO> filtered = new ArrayList<>();
        var studentList = repository.findAll();

        for (Student student : studentList) {
            StudentAverageDTO averageDTO = calculateAverage(student.getId());

            if (averageDTO.getStatus() == status) {
                filtered.add(averageDTO);
            }
        }
        return filtered;
    }

    private void addHateoasLinks(StudentDTO student) {
        student.add(linkTo(methodOn(StudentController.class).findStudentById(student.getId())).withSelfRel().withType("GET"));
        student.add(linkTo(methodOn(StudentController.class).findAllStudents()).withRel("findAll").withType("GET"));
        student.add(linkTo(methodOn(StudentController.class).postStudent(student)).withRel("create").withType("POST"));
        student.add(linkTo(methodOn(StudentController.class).putStudent(student)).withRel("update").withType("PUT"));
        student.add(linkTo(methodOn(StudentController.class).patchStudent(student.getId(), student)).withRel("patch").withType("PATCH"));
        student.add(linkTo(methodOn(StudentController.class).deleteStudent(student.getId())).withRel("delete").withType("DELETE"));
    }

    private void validateStudentFields(StudentDTO student) {
        if (student.getNotes() == null || student.getNotes().isEmpty() ||
                student.getBirthDate() == null || student.getBirthDate().isBlank() ||
                student.getName() == null || student.getName().isBlank() ||
                student.getCourse() == null || student.getCourse().isBlank() ||
                student.getClassSchool() == null || student.getClassSchool().isBlank() ||
                student.getRegistration() == null || student.getRegistration().isBlank())
        {
            throw new MissingRequiredFieldException("Mandatory fields are missing");
        }
    }

    private void validateStudentNotes(StudentDTO student) {
        if (student.getNotes() != null) {
            for (Double note : student.getNotes()) {
                if (note < 0 || note > 10) {
                    throw new InvalidGradeException("Grade must be between 0 and 10.");
                }
            }
        }
    }
}
