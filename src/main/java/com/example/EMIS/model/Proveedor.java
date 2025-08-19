package com.example.EMIS.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;


@Entity
public class Proveedor {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String nombre;
	private String direccion;
	private String email;
	private String telefono;
	
	
	@OneToMany(mappedBy = "proveedor", cascade = CascadeType.ALL)
	private List<Productopro> productos;
	
	public Proveedor() {
		// TODO Auto-generated constructor stub
	}
	
	
	
	public Proveedor(long id, String nombre, String direccion, String email, String password,List<Productopro> productos) {
		this.id = id;
		this.nombre = nombre;
		this.direccion = direccion;
		this.email = email;
		this.productos = productos;
	}



	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
		
	}
	
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public String getTelefono() {
		return telefono;
	}
	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
	
	
	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	

	
	@Override
	public String toString() {
		return "ID --> " + id + " Nombre --> "+ nombre+ "Direccion --> " + direccion + " Email --> " + email;
		
	}
	
}
