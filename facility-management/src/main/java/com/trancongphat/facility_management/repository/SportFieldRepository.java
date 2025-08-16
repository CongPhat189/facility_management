package com.trancongphat.facility_management.repository;



import com.trancongphat.facility_management.entity.SportField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SportFieldRepository extends JpaRepository<SportField, Integer> {

}
