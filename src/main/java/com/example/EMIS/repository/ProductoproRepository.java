package com.example.EMIS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.EMIS.model.Productopro;

import java.util.List;

@Repository
public interface ProductoproRepository extends JpaRepository<Productopro, Long> {
    List<Productopro> findByProveedorId(Long proveedorId);
}
