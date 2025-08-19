package com.example.EMIS.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.example.EMIS.Service.ProductoService;
import com.example.EMIS.model.Productopro;
import com.example.EMIS.repository.ProductoproRepository;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoproRepository productoRepository;

    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public List<Productopro> listarProductos() {
        return productoRepository.findAll();
    }

    @GetMapping("/proveedor/{proveedorId}")
    public ResponseEntity<List<Productopro>> obtenerProductosPorProveedor(@PathVariable Long proveedorId) {
        List<Productopro> productos = productoRepository.findByProveedorId(proveedorId);

        if (productos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(productos);
        }

        return ResponseEntity.ok(productos);
    }
   

    @PostMapping("/registrar/{proveedorId}")
    public ResponseEntity<Productopro> registrarProducto(@PathVariable Long proveedorId, @RequestBody Productopro producto) {
        Productopro productoGuardado = productoService.registrarProducto(proveedorId, producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoGuardado);
    }
    @PostMapping
    public Productopro crearProducto(@RequestBody Productopro producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Productopro actualizarProducto(@PathVariable Long id, @RequestBody Productopro productoActualizado) {
        Productopro producto = productoRepository.findById(id).orElseThrow();
        producto.setNombre(productoActualizado.getNombre());
        producto.setMarca(productoActualizado.getMarca());
        producto.setColor(productoActualizado.getColor());
        producto.setCategoria(productoActualizado.getCategoria());
        producto.setDimension(productoActualizado.getDimension());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setPrecio(productoActualizado.getPrecio());
        return productoRepository.save(producto);
    }
    
    @PutMapping("/{id}/cambiarEstado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Integer> estado){
    	int nuevoEstado = estado.get("estado");
    	boolean actualizado = productoService.actualizarEstado(id, nuevoEstado);
    	if(actualizado) {
    		return ResponseEntity.ok().body("Estado actualizado exitosamente");
    	}else {
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el estado");
    	}
    }
  

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }
    
      
    
}
