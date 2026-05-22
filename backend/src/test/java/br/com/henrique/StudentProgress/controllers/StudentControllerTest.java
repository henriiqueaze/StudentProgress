package br.com.henrique.StudentProgress.controllers;

import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.services.StudentService;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.text.SimpleDateFormat;
import java.util.*;

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
    void setup() throws Exception {
        sampleDto = new StudentDTO();
        sampleDto.setId(1L);
        sampleDto.setName("John Doe");
        Date bd = new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01");
        sampleDto.setBirthDate(bd);
        sampleDto.setCourse("Math");
        sampleDto.setClassSchool("A1");
        sampleDto.setRegistration("REG123");
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
    void findAllStudents_returnsPagedModel() {
        EntityModel<StudentDTO> em = EntityModel.of(sampleDto);
        PagedModel.PageMetadata metadata = new PagedModel.PageMetadata(
                12, 0, 1, 1
        );
        PagedModel<EntityModel<StudentDTO>> page = PagedModel.of(
                Collections.singletonList(em),
                metadata
        );

        PageRequest pageable = PageRequest.of(0, 12, Sort.by(Sort.Direction.ASC, "name"));
        when(service.findAll(pageable)).thenReturn(page);

        ResponseEntity<PagedModel<EntityModel<StudentDTO>>> response =
                controller.findAllStudents(0, 12, "asc");

        assertEquals(200, response.getStatusCodeValue());
        PagedModel<EntityModel<StudentDTO>> body = response.getBody();
        assertNotNull(body);
        assertEquals(1, body.getContent().size());
        assertEquals(0, body.getMetadata().getNumber());
        verify(service).findAll(pageable);
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
        patchDto.setBirthDate(sampleDto.getBirthDate());
        patchDto.setCourse(sampleDto.getCourse());
        patchDto.setClassSchool(sampleDto.getClassSchool());
        patchDto.setRegistration(sampleDto.getRegistration());
        patchDto.setNotes(sampleDto.getNotes());
        patchDto.setName("Jane Smith");

        StudentDTO patchedDto = new StudentDTO();
        patchedDto.setId(1L);
        patchedDto.setBirthDate(sampleDto.getBirthDate());
        patchedDto.setCourse(sampleDto.getCourse());
        patchedDto.setClassSchool(sampleDto.getClassSchool());
        patchedDto.setRegistration(sampleDto.getRegistration());
        patchedDto.setNotes(sampleDto.getNotes());
        patchedDto.setName("Jane Smith");

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
        when(service.filterByStatus(StudentStatus.APPROVED))
                .thenReturn(Collections.singletonList(sampleAvgDto));

        List<StudentAverageDTO> list = controller.filterStudentsByStatus("APPROVED");

        assertEquals(1, list.size());
        assertEquals(StudentStatus.APPROVED, list.get(0).getStatus());
        verify(service).filterByStatus(StudentStatus.APPROVED);
    }

    @Test
    void filterStudentsByStatus_invalidStatus_throwsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class,
                () -> controller.filterStudentsByStatus("UNKNOWN"));
    }
}
