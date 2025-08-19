package com.example.EMIS.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Productopro {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String marca;
	private String color;
	private String categoria;
	private String dimension;
	private String nombre;
	private String descripcion;
	private double precio;
	private int estado;
    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;
    
    
    public Productopro() {
		// TODO Auto-generated constructor stub
	}
    
    

	public Productopro(Long id, String marca, String color, String categoria, String dimension, String nombre,
			String descripcion, double precio, Proveedor proveedor, int estado) {
		this.id = id;
		this.marca = marca;
		this.color = color;
		this.categoria = categoria;
		this.dimension = dimension;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.precio = precio;
		this.proveedor = proveedor;
		this.estado = estado;
		
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getMarca() {
		return marca;
	}


	public void setMarca(String marca) {
		this.marca = marca;
	}


	public String getColor() {
		return color;
	}


	public void setColor(String color) {
		this.color = color;
	}


	public String getCategoria() {
		return categoria;
	}


	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}


	public String getDimension() {
		return dimension;
	}


	public void setDimension(String dimension) {
		this.dimension = dimension;
	}


	public String getNombre() {
		return nombre;
	}


	public void setNombre(String nombre) {
		this.nombre = nombre;
	}


	public String getDescripcion() {
		return descripcion;
	}


	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}


	public double getPrecio() {
		return precio;
	}


	public void setPrecio(double precio) {
		this.precio = precio;
	}


	public Proveedor getProveedor() {
		return proveedor;
	}


	public void setProveedor(Proveedor proveedor) {
		this.proveedor = proveedor;
	}
	
	public int getEstado() {
		return estado;
	}

	public void setEstado(int estado) {
		this.estado = estado;
	}
	@Override
	public String toString() {
		return "Producto [id=" + id + ", marca=" + marca + ", color=" + color + ", categoria=" + categoria
				+ ", dimension=" + dimension + ", nombre=" + nombre + ", descripcion=" + descripcion + ", precio="
				+ precio + ", proveedor=" + proveedor +"]";
	}
	
	
    
    
}
