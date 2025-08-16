package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.EquipmentRequestDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.entity.Equipment;
import com.trancongphat.facility_management.exception.ResourceNotFoundException;
import com.trancongphat.facility_management.mapper.EquipmentMapper;
import com.trancongphat.facility_management.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public EquipmentService(EquipmentRepository equipmentRepository, CloudinaryService cloudinaryService) {
        this.equipmentRepository = equipmentRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // Tạo mới thiết bị
    public EquipmentResponseDTO createEquipment(EquipmentRequestDTO dto) throws IOException {
        Equipment equipment = EquipmentMapper.toEntity(dto);

        MultipartFile imageFile = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            equipment.setImageUrl(imageUrl);
        }

        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentMapper.toDto(saved);
    }

    // Lấy tất cả thiết bị
    public List<EquipmentResponseDTO> getAllEquipments() {
        return equipmentRepository.findAll()
                .stream()
                .map(EquipmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // Lấy chi tiết thiết bị
    public EquipmentResponseDTO getEquipmentById(Integer id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thiết bị id = " + id));
        return EquipmentMapper.toDto(equipment);
    }

    // Cập nhật thiết bị
    public EquipmentResponseDTO updateEquipment(Integer id, EquipmentRequestDTO dto) throws IOException {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thiết bị id = " + id));

        equipment.setName(dto.getName());
        equipment.setEquipmentType(dto.getEquipmentType());
        equipment.setModel(dto.getModel());
        equipment.setSerialNumber(dto.getSerialNumber());
        equipment.setStatus(dto.getStatus());
        equipment.setPurchaseDate(dto.getPurchaseDate());
        equipment.setLastMaintenance(dto.getLastMaintenance());
        equipment.setAddress(dto.getAddress());

        MultipartFile imageFile = dto.getImageUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            equipment.setImageUrl(imageUrl);
        }

        Equipment updated = equipmentRepository.save(equipment);
        return EquipmentMapper.toDto(updated);
    }

    // Xoá thiết bị
    public void deleteEquipment(Integer id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thiết bị id = " + id));
        equipmentRepository.delete(equipment);
    }
}
