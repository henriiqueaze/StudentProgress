package br.com.henrique.StudentProgress.controllers;

import br.com.henrique.StudentProgress.services.StudentService;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private StudentService service;

    @InjectMocks
    private StudentController controller;

    private StudentDTO sample;

    @BeforeEach
    void setup() {
        sample = new StudentDTO();
        sample.setId(1L);
        sample.setNome("John Doe");
        sample.setCourse("Math");
        sample.setClassSchool("A1");
        sample.setRegistration("REG123");
        sample.setBirthDate("2000-01-01");
        sample.setNotes(Arrays.asList(8.0, 9.0));
    }

    @Test
    void findStudentById_returnsDto() {
        when(service.findById(1L)).thenReturn(sample);
        StudentDTO result = controller.findStudentById(1L);
        assertEquals(sample, result);
        verify(service).findById(1L);
    }

    @Test
    void findAllStudents_returnsList() {
        when(service.findAll()).thenReturn(Collections.singletonList(sample));
        List<StudentDTO> list = controller.findAllStudents();
        assertEquals(1, list.size());
        assertEquals(sample, list.get(0));
        verify(service).findAll();
    }

    @Test
    void postStudent_returnsPosted() {
        when(service.post(sample)).thenReturn(sample);
        StudentDTO result = controller.postStudent(sample);
        assertEquals(sample, result);
        verify(service).post(sample);
    }

    @Test
    void putStudent_returnsUpdated() {
        when(service.put(sample)).thenReturn(sample);
        StudentDTO result = controller.putStudent(sample);
        assertEquals(sample, result);
        verify(service).put(sample);
    }

    @Test
    void deleteStudent_returnsNoContent() {
        doNothing().when(service).delete(1L);
        ResponseEntity<?> response = controller.deleteStudent(1L);
        assertEquals(204, response.getStatusCodeValue());
        verify(service).delete(1L);
    }

    @Test
    void calculateStudentAverage_returnsAverage() {
        StudentAverageDTO avgDto = new StudentAverageDTO("John Doe", Arrays.asList(8.0, 9.0), 8.5, StudentStatus.APPROVED);
        when(service.calculateAverage(1L)).thenReturn(avgDto);
        StudentAverageDTO result = controller.calculateStudentAverage(1L);
        assertEquals(8.5, result.getAverage());
        assertEquals(StudentStatus.APPROVED, result.getStatus());
        verify(service).calculateAverage(1L);
    }
}