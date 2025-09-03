package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.ClassroomRequestDTO;
import com.trancongphat.facility_management.dto.ClassroomResponseDTO;
import com.trancongphat.facility_management.dto.EquipmentRequestDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.entity.Classroom;
import com.trancongphat.facility_management.entity.Equipment;
import com.trancongphat.facility_management.exception.ResourceNotFoundException;
import com.trancongphat.facility_management.mapper.ClassroomMapper;
import com.trancongphat.facility_management.mapper.EquipmentMapper;
import com.trancongphat.facility_management.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepo;
    @Autowired
    private CloudinaryService cloudinaryService;

    public ClassroomResponseDTO createClassroom(ClassroomRequestDTO dto) throws IOException {
        Classroom classroom = ClassroomMapper.toEntity(dto);

        MultipartFile imageFile = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            classroom.setImageUrl(imageUrl);
        }

        Classroom saved = classroomRepo.save(classroom);
        return ClassroomMapper.toDto(saved);
    }

    public ClassroomResponseDTO updateClassroom(Integer id, ClassroomRequestDTO dto) throws IOException {
        Classroom classroom = classroomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng học id = " + id));

        classroom.setRoomNumber(dto.getRoomNumber());
        classroom.setCapacity(dto.getCapacity());
        classroom.setDescription(dto.getDescription());
        classroom.setStatus(dto.getStatus());
        classroom.setAddress(dto.getAddress());


        MultipartFile imageFile = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            classroom.setImageUrl(imageUrl);
        }

        Classroom updated = classroomRepo.save(classroom);
        return ClassroomMapper.toDto(updated);
    }

    public void deleteClassroom(Integer id) {
        Classroom classroom = classroomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng học id = " + id));
        classroomRepo.delete(classroom);
    }

    public List<ClassroomResponseDTO> getAllClassrooms() {
        return classroomRepo.findAll()
                .stream()
                .map(ClassroomMapper::toDto)
                .collect(Collectors.toList());
    }
    public ClassroomResponseDTO getClassroomById(Integer id) {
        Classroom classroom = classroomRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng học id = " + id));
        return ClassroomMapper.toDto(classroom);
    }


}

