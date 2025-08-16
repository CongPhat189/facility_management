package com.trancongphat.facility_management.repository;
import com.trancongphat.facility_management.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Integer> {




}
