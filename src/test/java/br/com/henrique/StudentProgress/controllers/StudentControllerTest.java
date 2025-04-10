package br.com.henrique.StudentProgress.controllers;

import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.services.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StudentControllerTest {

    @InjectMocks
    private StudentController studentController;

    @Mock
    private StudentService studentService;

    private MockMvc mockMvc;
    private StudentDTO studentDTO;
    private StudentAverageDTO studentAverageDTO;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(studentController).build();

        studentDTO = new StudentDTO();
        studentDTO.setId(1L);
        studentDTO.setNome("John Doe");
        studentDTO.setBirthDate("2000-01-01");
        studentDTO.setCpf("12345678900");
        studentDTO.setEmail("john@example.com");
        studentDTO.setRegistration("REG123");
        studentDTO.setCourse("Computer Science");
        studentDTO.setClassSchool("A1");
        studentDTO.setNotes(List.of(8.0, 9.0, 7.0));

        studentAverageDTO = new StudentAverageDTO("John Doe", studentDTO.getNotes(), 8.0, StudentStatus.APPROVED);
    }

    @Test
    void testFindStudentById() throws Exception {
        when(studentService.findById(1L)).thenReturn(studentDTO);

        mockMvc.perform(get("/student/{id}", 1L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nome", is("John Doe")));
    }

    @Test
    void testFindAllStudents() throws Exception {
        when(studentService.findAll()).thenReturn(List.of(studentDTO));

        mockMvc.perform(get("/student")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].nome", is("John Doe")));
    }

    @Test
    void testPostStudent() throws Exception {
        when(studentService.post(any(StudentDTO.class))).thenReturn(studentDTO);

        String jsonContent = objectMapper.writeValueAsString(studentDTO);

        mockMvc.perform(post("/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonContent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome", is("John Doe")));
    }

    @Test
    void testPutStudent() throws Exception {
        when(studentService.put(any(StudentDTO.class))).thenReturn(studentDTO);

        String jsonContent = objectMapper.writeValueAsString(studentDTO);

        mockMvc.perform(put("/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonContent))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome", is("John Doe")));
    }

    @Test
    void testDeleteStudent() throws Exception {
        doNothing().when(studentService).delete(anyLong());

        mockMvc.perform(delete("/student/{id}", 1L))
                .andExpect(status().isNoContent());

        verify(studentService, times(1)).delete(1L);
    }

    @Test
    void testCalculateStudentAverage() throws Exception {
        when(studentService.calculateAverage(1L)).thenReturn(studentAverageDTO);

        mockMvc.perform(get("/student/average/{id}", 1L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentName", is("John Doe")))
                .andExpect(jsonPath("$.average", is(8.0)));
    }
}
