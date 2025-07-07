package br.com.henrique.StudentProgress.serialization.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Collections;
import java.util.List;

@Converter
public class NotesConverter implements AttributeConverter<List<Double>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Double> notes) {
        try {
            return mapper.writeValueAsString(notes);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error converting notes to JSON", e);
        }
    }

    @Override
    public List<Double> convertToEntityAttribute(String dbData) {
        try {
            if (dbData == null || dbData.isBlank()) {
                return Collections.emptyList();
            }
            return mapper.readValue(dbData, new TypeReference<List<Double>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Error reading notes from JSON", e);
        }
    }
}
