package br.com.henrique.StudentProgress.controllers;

import br.com.henrique.StudentProgress.controllers.docs.StudentControllerDocs;
import br.com.henrique.StudentProgress.model.enums.StudentStatus;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentAverageDTO;
import br.com.henrique.StudentProgress.transfer.DTOs.StudentDTO;
import br.com.henrique.StudentProgress.services.StudentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@Tag(name = "Student", description = "Endpoints for Managing Students")
public class StudentController implements StudentControllerDocs {

    @Autowired
    private StudentService service;

    @GetMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public StudentDTO findStudentById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public ResponseEntity<PagedModel<EntityModel<StudentDTO>>> findAllStudents(@RequestParam(value = "page", defaultValue = "0") Integer page, @RequestParam(value = "size", defaultValue = "12") Integer size, @RequestParam(value = "direction", defaultValue = "asc") String direction) {
        var sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, "name"));
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @PostMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public ResponseEntity<StudentDTO> postStudent(@RequestBody StudentDTO student) {
        var entity = service.post(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(entity);
    }

    @PutMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public StudentDTO putStudent(@RequestBody StudentDTO student) {
        return service.put(student);
    }

    @PatchMapping(value = {"/{id}"}, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public StudentDTO patchStudent(@PathVariable Long id, @RequestBody StudentDTO student) {
        return service.patch(id, student);
    }

    @DeleteMapping(value = "/{id}")
    @Override
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/average/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public StudentAverageDTO calculateStudentAverage(@PathVariable Long id) {
        return service.calculateAverage(id);
    }

    @GetMapping(value = "/filter/{statusString}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_YAML_VALUE})
    @Override
    public List<StudentAverageDTO> filterStudentsByStatus (@PathVariable String statusString) {
        StudentStatus status = StudentStatus.valueOf(statusString);
        return service.filterByStatus(status);
    }
}
