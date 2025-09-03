package com.trancongphat.facility_management.service;


import com.trancongphat.facility_management.dto.EquipmentRequestDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.dto.SportFieldRequestDTO;

import com.trancongphat.facility_management.dto.SportFieldResponseDTO;
import com.trancongphat.facility_management.entity.Equipment;
import com.trancongphat.facility_management.entity.SportField;
import com.trancongphat.facility_management.exception.ResourceNotFoundException;
import com.trancongphat.facility_management.mapper.EquipmentMapper;
import com.trancongphat.facility_management.mapper.SportFieldMapper;
import com.trancongphat.facility_management.repository.SportFieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SportFieldService {
    @Autowired
    private SportFieldRepository sportFieldRepo;
    @Autowired
    private CloudinaryService cloudinaryService;


    public SportFieldResponseDTO createSportField(SportFieldRequestDTO dto) throws IOException {
        SportField sportField = SportFieldMapper.toEntity(dto);

        MultipartFile imageFile = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            sportField.setImageUrl(imageUrl);
        }

        SportField saved = sportFieldRepo.save(sportField);
        return SportFieldMapper.toDto(saved);
    }


    public SportFieldResponseDTO updateSportField(Integer id, SportFieldRequestDTO dto) throws IOException {
        SportField sportField = sportFieldRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân thể thao id = " + id));

        sportField.setFieldName(dto.getFieldName());
        sportField.setFieldType(dto.getFieldType());
        sportField.setPricePerHour(dto.getPricePerHour());
        sportField.setStatus(dto.getStatus());
        sportField.setDescription(dto.getDescription());
        sportField.setAddress(dto.getAddress());


        MultipartFile imageFile = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            sportField.setImageUrl(imageUrl);
        }

        SportField updated = sportFieldRepo.save(sportField);
        return SportFieldMapper.toDto(updated);
    }
    public void deleteSportField(Integer id) {
        SportField sportField = sportFieldRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân thể thao id = " + id));
        sportFieldRepo.delete(sportField);
    }
    public List<SportFieldResponseDTO> getAllSportFields() {
        return sportFieldRepo.findAll()
                .stream()
                .map(SportFieldMapper::toDto)
                .collect(Collectors.toList());
    }
    public SportFieldResponseDTO getSportFieldById(Integer id) {
        SportField sf = sportFieldRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân thể thao id = " + id));
        return SportFieldMapper.toDto(sf);
    }

}
