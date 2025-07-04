package br.com.henrique.StudentProgress.services;

import br.com.henrique.StudentProgress.controllers.StudentController;
import br.com.henrique.StudentProgress.exceptions.IdNotFoundException;
import br.com.henrique.StudentProgress.exceptions.InvalidGradeException;
import br.com.henrique.StudentProgress.exceptions.InvalidStatusExcepetion;
import br.com.henrique.StudentProgress.exceptions.MissingRequiredFieldException;
import br.com.henrique.StudentProgress.infra.repositories.StudentRepository;
import br.com.henrique.StudentProgress.model.entities.Student;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
    void patch_valid_updatesPartial() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        StudentDTO patchDto = new StudentDTO();
        patchDto.setName("John");
        var result = service.patch(1L, patchDto);
        assertEquals("John", result.getName());
        assertEquals(entity.getCourse(), result.getCourse());
        verify(repository).findById(1L);
        verify(repository).save(entity);
    }

    @Test
    void patch_invalidGrade_throws() {
        StudentDTO patchDto = new StudentDTO();
        patchDto.setNotes(Arrays.asList(11.0));

        assertThrows(InvalidGradeException.class, () -> service.patch(1L, patchDto));

        verify(repository, never()).findById(anyLong());
        verify(repository, never()).save(any());
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
    void calculateAverage_approvedAndRecoveryAndFailed() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        var avg = service.calculateAverage(1L);
        assertEquals(StudentStatus.RECOVERY, avg.getStatus());

        entity.setNotes(Arrays.asList(8.0, 7.0, 9.0));
        avg = service.calculateAverage(1L);
        assertEquals(StudentStatus.APPROVED, avg.getStatus());

        entity.setNotes(Arrays.asList(2.0, 3.0));
        avg = service.calculateAverage(1L);
        assertEquals(StudentStatus.FAILED, avg.getStatus());
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

    @Test
    void filterByStatus_validFilters() {
        Student s1 = new Student(); s1.setId(1L); s1.setNotes(Arrays.asList(8.0, 9.0)); s1.setName("A");
        Student s2 = new Student(); s2.setId(2L); s2.setNotes(Arrays.asList(5.0, 6.0)); s2.setName("B");
        Student s3 = new Student(); s3.setId(3L); s3.setNotes(Arrays.asList(2.0, 3.0)); s3.setName("C");
        when(repository.findAll()).thenReturn(Arrays.asList(s1, s2, s3));
        when(repository.findById(1L)).thenReturn(Optional.of(s1));
        when(repository.findById(2L)).thenReturn(Optional.of(s2));
        when(repository.findById(3L)).thenReturn(Optional.of(s3));

        List<StudentAverageDTO> approved = service.filterByStatus(StudentStatus.APPROVED);
        assertEquals(1, approved.size());
        assertEquals(StudentStatus.APPROVED, approved.get(0).getStatus());

        List<StudentAverageDTO> recovery = service.filterByStatus(StudentStatus.RECOVERY);
        assertEquals(1, recovery.size());
        assertEquals(StudentStatus.RECOVERY, recovery.get(0).getStatus());

        List<StudentAverageDTO> failed = service.filterByStatus(StudentStatus.FAILED);
        assertEquals(1, failed.size());
        assertEquals(StudentStatus.FAILED, failed.get(0).getStatus());
    }

    @Test
    void filterByStatus_nullStatus_throws() {
        assertThrows(InvalidStatusExcepetion.class, () -> service.filterByStatus(null));
    }
}
