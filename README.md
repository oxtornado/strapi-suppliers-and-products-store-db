# 📦 Proveedores, Productos y Categorías

Este proyecto implementa una API con **Strapi** y **SQLite** para gestionar la relación entre **proveedores**, **productos** y **categorías** en una tienda.

## 📌 Objetivo
Desarrollar un sistema que permita consultar proveedores, productos y sus respectivas categorías, garantizando la integridad de los datos y cumpliendo con las reglas de negocio establecidas.

## 🛠️ Tecnologías utilizadas
- **Strapi** (Backend CMS)
- **SQLite** (Base de datos ligera)
- **Node.js** y **JavaScript**

## 🏗️ Modelo de Datos
- **Proveedores**: Nombre, dirección, teléfono, correo electrónico, contacto.
- **Productos**: Nombre, descripción, precio, cantidad en stock, proveedor asociado.
- **Categorías**: Nombre y descripción.
- **Relaciones**:
  - Un **proveedor** puede suministrar varios **productos** (1:N).
  - Un **producto** pertenece a un solo **proveedor** (N:1).
  - Un **producto** puede estar en varias **categorías** (N:M).
  - Una **categoría** puede contener varios **productos** (N:M).

## 📜 Reglas de negocio
1. Cada producto debe estar asociado a un proveedor.
2. Un producto debe pertenecer al menos a una categoría.
3. Un proveedor puede proveer varios productos, pero cada producto solo puede tener un proveedor.

## 🔍 Consultas esperadas

### 1️⃣ Listar todos los productos de un proveedor específico
```json
{
    "method": "GET",
    "path": "/proveedor/productos/:id",
    "handler": "proveedor.findProductosByProveedor",
    "config": {
        "policies": []
    }
}
```
📌 **Ruta:** `src/api/proveedor/routes/proveedor.ts`

### 2️⃣ Consultar categorías en las que está clasificado un producto
```json
{
    "method": "GET",
    "path": "/producto/:id/categorias",
    "handler": "clasificacion.findCategoriasByProducto",
    "config": {
        "policies": []
    }
}
```
📌 **Ruta:** `src/api/clasificacion/routes/clasificacion.ts`

### 3️⃣ Consultar productos con una categoría específica
```json
{
    "method": "GET",
    "path": "/categoria/:id/productos",
    "handler": "producto.findProductosByCategoria",
    "config": {
        "policies": []
    }
}
```
📌 **Ruta:** `src/api/producto/routes/producto.ts`

### 4️⃣ Listar productos que pertenecen a múltiples categorías
```json
{
    "method": "GET",
    "path": "/categorias/:categorias/productos",
    "handler": "producto.findProductosByCategorias",
    "config": {
        "policies": []
    }
}
```
📌 **Ruta:** `src/api/producto/routes/producto.ts`

### 5️⃣ Obtener información detallada de un proveedor junto a sus productos
```json
{
    "method": "GET",
    "path": "/proveedor/:id/productos",
    "handler": "proveedor.findProveedorByProductos",
    "config": {
        "policies": []
    }
}
```
📌 **Ruta:** `src/api/proveedor/routes/proveedor.ts`

## 🚀 Instalación y ejecución
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/tu-repo/proveedores-productos-categorias.git
   ```
2. Instalar dependencias:
   ```sh
   cd proveedores-productos-categorias
   npm install
   ```
3. Iniciar el servidor Strapi:
   ```sh
   npm run develop
   ```
4. Acceder a la interfaz de administración de Strapi en:
   ```sh
   http://localhost:1337/admin
   ```

## 📩 Contacto
Si tienes preguntas o sugerencias, puedes escribirme a [mi correo electrónico!!!](mailto:tucorreo@gmail.com).

## 🤝 Contribuciones
Puedes contribuir a este proyecto con:
- Reportando errores
- Haciendo solicitudes de mejoras
- Agregando nuevas funcionalidades
- Traduciendo el proyecto a otros idiomas

