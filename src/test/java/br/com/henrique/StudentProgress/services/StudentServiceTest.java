package br.com.henrique.StudentProgress.services;

import br.com.henrique.StudentProgress.model.entities.Student;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.infra.repositories.StudentRepository;
import br.com.henrique.StudentProgress.exceptions.IdNotFoundException;
import br.com.henrique.StudentProgress.exceptions.InvalidGradeException;
import br.com.henrique.StudentProgress.exceptions.MissingRequiredFieldException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository repository;

    @InjectMocks
    private StudentService service;

    private Student entity;
    private StudentDTO dto;

    @BeforeEach
    void setup() {
        entity = new Student();
        entity.setId(1L);
        entity.setName("Jane");
        entity.setCourse("Science");
        entity.setClassSchool("B2");
        entity.setRegistration("REG456");
        entity.setBirthDate("1999-05-05");
        entity.setNotes(Arrays.asList(5.0, 7.0));

        dto = new StudentDTO();
        dto.setId(1L);
        dto.setName("Jane");
        dto.setCourse("Science");
        dto.setClassSchool("B2");
        dto.setRegistration("REG456");
        dto.setBirthDate("1999-05-05");
        dto.setNotes(Arrays.asList(5.0, 7.0));
    }

    @Test
    void findById_returnsDto() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        var result = service.findById(1L);
        assertEquals(dto.getName(), result.getName());
        verify(repository).findById(1L);
    }

    @Test
    void findById_notFound_throws() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IdNotFoundException.class, () -> service.findById(1L));
    }

    @Test
    void findAll_returnsList() {
        when(repository.findAll()).thenReturn(Collections.singletonList(entity));
        var list = service.findAll();
        assertEquals(1, list.size());
        verify(repository).findAll();
    }

    @Test
    void post_valid_returnsDto() {
        when(repository.save(any(Student.class))).thenReturn(entity);
        var result = service.post(dto);
        assertEquals(dto.getName(), result.getName());
        verify(repository).save(any(Student.class));
    }

    @Test
    void post_invalidGrade_throws() {
        dto.setNotes(Arrays.asList(-1.0));
        assertThrows(InvalidGradeException.class, () -> service.post(dto));
    }

    @Test
    void post_missingFields_throws() {
        dto.setNotes(Collections.emptyList());
        assertThrows(MissingRequiredFieldException.class, () -> service.post(dto));
    }

    @Test
    void put_valid_updates() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        when(repository.save(entity)).thenReturn(entity);
        var result = service.put(dto);
        assertEquals(dto.getName(), result.getName());
        verify(repository).findById(1L);
        verify(repository).save(entity);
    }

    @Test
    void put_notFound_throws() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IdNotFoundException.class, () -> service.put(dto));
    }

    @Test
    void delete_existing_deletes() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        doNothing().when(repository).delete(entity);
        service.delete(1L);
        verify(repository).delete(entity);
    }

    @Test
    void delete_notFound_throws() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IdNotFoundException.class, () -> service.delete(1L));
    }

    @Test
    void calculateAverage_approved() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        var avg = service.calculateAverage(1L);
        double expected = new BigDecimal(12).divide(new BigDecimal(2), 1, BigDecimal.ROUND_HALF_UP).doubleValue();
        assertEquals(expected, avg.getAverage());
        assertEquals(StudentStatus.RECOVERY, avg.getStatus());
    }

    @Test
    void calculateAverage_noGrades_throws() {
        entity.setNotes(Collections.emptyList());
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        assertThrows(IllegalArgumentException.class, () -> service.calculateAverage(1L));
    }

    @Test
    void calculateAverage_notFound_throws() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IdNotFoundException.class, () -> service.calculateAverage(1L));
    }
}