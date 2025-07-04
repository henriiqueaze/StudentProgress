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

    private StudentDTO sampleDto;
    private StudentAverageDTO sampleAvgDto;

    @BeforeEach
    void setup() {
        sampleDto = new StudentDTO();
        sampleDto.setId(1L);
        sampleDto.setName("John Doe");
        sampleDto.setCourse("Math");
        sampleDto.setClassSchool("A1");
        sampleDto.setRegistration("REG123");
        sampleDto.setBirthDate("2000-01-01");
        sampleDto.setNotes(Arrays.asList(8.0, 9.0));

        sampleAvgDto = new StudentAverageDTO(
                "John Doe",
                Arrays.asList(8.0, 9.0),
                8.5,
                StudentStatus.APPROVED
        );
    }

    @Test
    void findStudentById_returnsDto() {
        when(service.findById(1L)).thenReturn(sampleDto);
        StudentDTO result = controller.findStudentById(1L);
        assertEquals(sampleDto, result);
        verify(service).findById(1L);
    }

    @Test
    void findAllStudents_returnsList() {
        when(service.findAll()).thenReturn(Collections.singletonList(sampleDto));
        List<StudentDTO> list = controller.findAllStudents();
        assertEquals(1, list.size());
        assertEquals(sampleDto, list.get(0));
        verify(service).findAll();
    }

    @Test
    void postStudent_returnsCreated() {
        when(service.post(sampleDto)).thenReturn(sampleDto);
        ResponseEntity<StudentDTO> response = controller.postStudent(sampleDto);
        assertEquals(201, response.getStatusCodeValue());
        assertEquals(sampleDto, response.getBody());
        verify(service).post(sampleDto);
    }

    @Test
    void putStudent_returnsUpdated() {
        when(service.put(sampleDto)).thenReturn(sampleDto);
        StudentDTO result = controller.putStudent(sampleDto);
        assertEquals(sampleDto, result);
        verify(service).put(sampleDto);
    }

    @Test
    void patchStudent_returnsPatched() {
        StudentDTO patchDto = new StudentDTO();
        patchDto.setName("Jane Smith");
        StudentDTO patchedDto = new StudentDTO();
        patchedDto.setId(1L);
        patchedDto.setName("Jane Smith");
        patchedDto.setCourse(sampleDto.getCourse());
        patchedDto.setClassSchool(sampleDto.getClassSchool());
        patchedDto.setRegistration(sampleDto.getRegistration());
        patchedDto.setBirthDate(sampleDto.getBirthDate());
        patchedDto.setNotes(sampleDto.getNotes());

        when(service.patch(1L, patchDto)).thenReturn(patchedDto);
        StudentDTO result = controller.patchStudent(1L, patchDto);
        assertEquals("Jane Smith", result.getName());
        verify(service).patch(1L, patchDto);
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
        when(service.calculateAverage(1L)).thenReturn(sampleAvgDto);
        StudentAverageDTO result = controller.calculateStudentAverage(1L);
        assertEquals(sampleAvgDto, result);
        verify(service).calculateAverage(1L);
    }

    @Test
    void filterStudentsByStatus_validStatus_returnsList() {
        when(service.filterByStatus(StudentStatus.APPROVED)).thenReturn(Collections.singletonList(sampleAvgDto));
        List<StudentAverageDTO> list = controller.filterStudentsByStatus("APPROVED");
        assertEquals(1, list.size());
        assertEquals(StudentStatus.APPROVED, list.get(0).getStatus());
        verify(service).filterByStatus(StudentStatus.APPROVED);
    }

    @Test
    void filterStudentsByStatus_invalidStatus_throwsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () -> controller.filterStudentsByStatus("UNKNOWN"));
    }
}
