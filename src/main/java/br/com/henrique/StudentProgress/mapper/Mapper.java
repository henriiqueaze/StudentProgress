package br.com.henrique.StudentProgress.mapper;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;

public class Mapper {
    static ModelMapper  mapper = new ModelMapper();

    static {
        mapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
    }

    public static <O, D> D parseObjects (O origin, Class<D> destination) {
        return mapper.map(origin, destination);
    }

    public static <O, D> void mapNonNullFields (O origin, D destination) {
        mapper.map(origin, destination);
    }

    public static <O, D> List<D> parseListObjects(List<O> origin, Class<D> destination) {
        ArrayList<D> originObjects = new ArrayList<>();

        for (O o : origin) {
            originObjects.add(mapper.map(o, destination));
        }

        return originObjects;
    }
}
