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