package br.com.henrique.StudentProgress.controllers;

import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.services.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@Tag(name = "Student", description = "Endpoints for Managing Students")
public class StudentController {

    @Autowired
    private StudentService service;

    @Operation(summary = "Find a Student", description = "Finds a Student by his ID", tags = {"Student"}, responses = {@ApiResponse(description = "Success", responseCode = "200", content = @Content(schema = @Schema(implementation = StudentDTO.class))),
                                                                                                                        @ApiResponse(description = "No Content", responseCode = "204", content = @Content),
                                                                                                                        @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                                                                                                                        @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                                                                                                                        @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)})
    @GetMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    public StudentDTO findStudentById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Operation(summary = "Find All Students", description = "Finds All Students", tags = {"Student"}, responses = {@ApiResponse(description = "Success", responseCode = "200", content = {@Content (mediaType = MediaType.APPLICATION_JSON_VALUE, array = @ArraySchema(schema = @Schema(implementation = StudentDTO.class)))}),
                                                                                                                    @ApiResponse(description = "No Content", responseCode = "204", content = @Content),
                                                                                                                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                                                                                                                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                                                                                                                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)})
    public List<StudentDTO> findAllStudents() {
        return service.findAll();
    }

    @PostMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Operation(summary = "Posts a Student", description = "Create a Student", tags = {"Student"}, responses = {@ApiResponse(description = "Success", responseCode = "200", content = {@Content (schema = @Schema(implementation = StudentDTO.class))}),
                                                                                                                @ApiResponse(description = "No Content", responseCode = "204", content = @Content),
                                                                                                                @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                                                                                                                @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                                                                                                                @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)})
    public StudentDTO postStudent(@RequestBody StudentDTO student) {
        return service.post(student);
    }

    @PutMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Operation(summary = "Puts a Student", description = "Updates a Student", tags = {"Student"}, responses = {@ApiResponse(description = "Success", responseCode = "200", content = {@Content (schema = @Schema(implementation = StudentDTO.class))}),
                                                                                                                @ApiResponse(description = "No Content", responseCode = "204", content = @Content),
                                                                                                                @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                                                                                                                @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                                                                                                                @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)})
    public StudentDTO putStudent(@RequestBody StudentDTO student) {
        return service.put(student);
    }

    @DeleteMapping(value = "/{id}")
    @Operation(summary = "Deletes a Student", description = "Deletes a Student", tags = {"Student"}, responses = {@ApiResponse(description = "Success", responseCode = "200", content = {@Content (schema = @Schema(implementation = StudentDTO.class))}),
                                                                                                                    @ApiResponse(description = "No Content", responseCode = "204", content = @Content),
                                                                                                                    @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                                                                                                                    @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                                                                                                                    @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)})
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/average/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Operation(summary = "Student Grade Point Average", description = "Shows the Student Grade Point Average", tags = {"Student"}, responses = {@ApiResponse(description = "Success", responseCode = "200", content = {@Content (schema = @Schema(implementation = StudentDTO.class))}),
                                                                                                                                                @ApiResponse(description = "No Content", responseCode = "204", content = @Content),
                                                                                                                                                @ApiResponse(description = "Unauthorized", responseCode = "401", content = @Content),
                                                                                                                                                @ApiResponse(description = "Not Found", responseCode = "404", content = @Content),
                                                                                                                                                @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)})
    public StudentAverageDTO calculateStudentAverage(@PathVariable Long id) {
        return service.calculateAverage(id);
    }
}
