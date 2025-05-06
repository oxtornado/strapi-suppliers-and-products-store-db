import { factories } from '@strapi/strapi';
import producto from '../routes/producto';

export default factories.createCoreController('api::producto.producto', ({ strapi }) => ({
  async findOne(ctx) {
    const { query, params } = ctx;
    return await strapi.services.producto.findOne({ query, params });
  },

  async findMany(ctx) {
    const { query, params } = ctx;
    return await strapi.services.producto.find({ query, params });
  },

  async update(ctx) {
    const { data, params } = ctx;
    return await strapi.services.producto.update({ data, params });
  },

  async delete(ctx) {
    const { data, params } = ctx;
    return await strapi.services.producto.delete({ data, params });
  },

  async create(ctx) {
    const { proveedor, categorias, ...productoData } = ctx.request.body; // el ... extrae el resto de propiedades del objeto

    if (!proveedor) return ctx.badRequest('El proveedor es obligatorio.'); // i. Cada producto debe estar asociado a un proveedor.
    if (!await proveedorValido(proveedor)) return ctx.badRequest('El proveedor no existe.'); // verificamos si el proveedor existe
    if (!(proveedor?.length !== 1)) return ctx.badRequest('El producto debe tener solo un proveedor.'); // iii. ...cada producto solo puede tener un proveedor.
    if (!categorias?.length) return ctx.badRequest('El producto debe tener al menos una categoría.'); // ii. Un producto debe estar vinculado al menos a una categoría.

    const producto = await strapi.db.query('api::producto.producto').create({ data: { proveedor, ...productoData } });
    await vincularCategorias(producto.id, categorias);

    return { producto };
  },

  // Función para consultar productos con un proveedor específico
  async findProductosByProveedor(ctx) {
    console.log("FINDPROVEEDORPRODUCTOS!!!");
    const { id } = ctx.params;

    console.log("ID: ", id);

    // Verificar si el proveedor existe
    const proveedor = await strapi.db.query('api::proveedor.proveedor').findOne({ where: { id } });

    console.log("Proveedor: ", proveedor);
    if (!proveedor) return ctx.badRequest('El proveedor no existe.');

    // Obtener productos del proveedor
    const productos = await strapi.db.query('api::producto.producto').findMany({ where: { proveedor: id } });
    console.log("Productos: ", productos);

    const nombre = await proveedor.nombreProveedor;

    return { nombre , productos };
  },

  async findCategoriasByProducto(ctx) {
    const { id } = ctx.params;
  
    const producto = await strapi.db.query('api::producto.producto').findOne({
      where: { id },
      populate: false,
    });
  
    if (!producto) return ctx.badRequest("El producto no existe.");
  
    const clasificaciones = await strapi.db.query('api::clasificacion.clasificacion').findMany({
      where: { producto: id },
    });
  
    const categoriasPorClasificacion = await Promise.all(
      clasificaciones.map(async (clasificacion) => {
        const categorias = await strapi.db.query('api::categoria.categoria').findMany({
          where: {
            clasificacion: clasificacion.id,
          },
        });
        return categorias.map(c => c.nombreCategoria);
      })
    );
  
    // Aplanar el array
    const categorias = categoriasPorClasificacion.flat();
  
    return {
      producto: producto.nombreProducto,
      categorias,
    };
  },  

  async findByProveedor(ctx) {
    let idProveedor; 
    
    try {
      // 1. Input Validation Pattern
      idProveedor = ctx.params.idProveedor;
      if (!idProveedor) {
        return ctx.badRequest('El ID del proveedor es requerido');
      }

      // 2. Type Validation Pattern
      const proveedorId = parseInt(idProveedor);
      if (isNaN(proveedorId)) {
        return ctx.badRequest('El ID del proveedor debe ser un número');
      }

      // 3. Existence Validation Pattern
      const existeProveedor = await strapi.db.query('api::proveedor.proveedor').findOne({
        where: { id: proveedorId },
        select: ['nombreProveedor']
      });

      if (!existeProveedor) {
        return ctx.notFound(`No se encontró el proveedor con id: ${proveedorId}`);
      }

      // 4. Data Retrieval Pattern with Error Boundary
      let productosProveedor;
      try {
        productosProveedor = await strapi.db.query('api::producto.producto').findMany({
          where: { proveedor: proveedorId },
          select: ['nombreProducto', 'precioProducto']
        });
      } catch (dbError) {
        console.error('Error al consultar productos:', {
          error: dbError,
          proveedorId,
          timestamp: new Date().toISOString()
        });
        return ctx.internalServerError('Error al consultar los productos');
      }

      // 5. Empty Results Handling Pattern
      if (!productosProveedor.length) {
        return {
          "el proveedor": existeProveedor.nombreProveedor,
          "mensaje": "Este proveedor no tiene productos asociados",
          "productos": []
        };
      }

      // 6. Success Response Pattern
      return {
        "el proveedor": existeProveedor.nombreProveedor,
        "tiene asociados los productos": productosProveedor
      };

    } catch (error) {
      // 7. Detailed Error Logging Pattern
      console.error('Error en findByProveedor:', {
        error: error.message,
        stack: error.stack,
        proveedorId: idProveedor,
        timestamp: new Date().toISOString()
      });
      
      // 8. User-Friendly Error Response Pattern
      return ctx.internalServerError('Ha ocurrido un error al procesar su solicitud');
    }
  }
}));

// 🔹 Función para validar si el proveedor existe
async function proveedorValido(proveedor) {
  return !!await strapi.db.query('api::proveedor.proveedor').findOne({ where: { id: proveedor } });
}

// 🔹 Función para vincular el producto con sus categorías en la tabla intermedia
async function vincularCategorias(idProducto, categorias) {
  await Promise.all(
    categorias.map(idCategoria =>
      strapi.db.query('api::clasificacion.clasificacion').create({ data: { idProducto, idCategoria } })
    )
  );
}