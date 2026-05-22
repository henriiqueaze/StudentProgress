package br.com.henrique.StudentProgress.infra.repositories;

import br.com.henrique.StudentProgress.model.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
