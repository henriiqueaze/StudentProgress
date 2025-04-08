package br.com.henrique.StudentProgress.services;

import br.com.henrique.StudentProgress.exceptions.IdNotFoundException;
import br.com.henrique.StudentProgress.exceptions.InvalidGradeException;
import br.com.henrique.StudentProgress.exceptions.MissingRequiredFieldException;
import br.com.henrique.StudentProgress.model.entities.Student;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.infra.repositories.StudentRepository;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @InjectMocks
    private StudentService studentService;

    @Mock
    private StudentRepository repository;

    private Student student;
    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        student.setNome("John Doe");
        student.setBirthDate("2000-01-01");
        student.setCpf("12345678900");
        student.setEmail("john@example.com");
        student.setRegistration("REG123");
        student.setCourse("Computer Science");
        student.setClassSchool("A1");
        student.setNotes(Arrays.asList(8.0, 9.0, 7.0));

        studentDTO = new StudentDTO();
        studentDTO.setId(1L);
        studentDTO.setNome("John Doe");
        studentDTO.setBirthDate("2000-01-01");
        studentDTO.setCpf("12345678900");
        studentDTO.setEmail("john@example.com");
        studentDTO.setRegistration("REG123");
        studentDTO.setCourse("Computer Science");
        studentDTO.setClassSchool("A1");
        studentDTO.setNotes(Arrays.asList(8.0, 9.0, 7.0));
    }

    @Test
    void testFindById_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(student));

        StudentDTO result = studentService.findById(1L);
        assertNotNull(result);
        assertEquals("John Doe", result.getNome());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void testFindById_NotFound() {
        when(repository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(IdNotFoundException.class, () -> studentService.findById(1L));
    }

    @Test
    void testPostStudent_Valid() {
        when(repository.save(any(Student.class))).thenReturn(student);

        StudentDTO created = studentService.post(studentDTO);
        assertNotNull(created);
        assertEquals("John Doe", created.getNome());
        verify(repository, times(1)).save(any(Student.class));
    }

    @Test
    void testPostStudent_InvalidGrade() {
        studentDTO.setNotes(Collections.singletonList(11.0));
        assertThrows(InvalidGradeException.class, () -> studentService.post(studentDTO));
    }

    @Test
    void testPostStudent_MissingFields() {
        studentDTO.setNome("");
        studentDTO.setBirthDate(null);
        studentDTO.setCourse("");
        studentDTO.setClassSchool("");
        studentDTO.setRegistration("");
        assertThrows(MissingRequiredFieldException.class, () -> studentService.post(studentDTO));
    }

    @Test
    void testPutStudent_Success() {
        studentDTO.setNome("John Updated");
        when(repository.findById(1L)).thenReturn(Optional.of(student));
        when(repository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.put(studentDTO);
        assertNotNull(result);
        verify(repository, times(1)).save(any(Student.class));
    }

    @Test
    void testDeleteStudent_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(student));
        doNothing().when(repository).delete(student);

        assertDoesNotThrow(() -> studentService.delete(1L));
        verify(repository, times(1)).delete(student);
    }

    @Test
    void testCalculateAverage_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(student));

        StudentAverageDTO avgDTO = studentService.calculateAverage(1L);
        assertNotNull(avgDTO);
        assertEquals("John Doe", avgDTO.getStudentName());
        assertEquals(8.0, avgDTO.getAverage());
        assertEquals(StudentStatus.APPROVED, avgDTO.getStatus());
    }
}
