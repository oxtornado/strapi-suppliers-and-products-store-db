import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::proveedor.proveedor', ({ strapi }) => ({
  async findOne(ctx) {
    const { query, params } = ctx;
    return await strapi.services.proveedor.findOne({ query, params });
  },

  async findMany(ctx) {
    const { query, params } = ctx;
    return await strapi.services.proveedor.find({ query, params });
  },

  async update(ctx) {
    const { data, params } = ctx;
    return await strapi.services.proveedor.update({ data, params });
  },

  async delete(ctx) {
    const { data, params } = ctx;
    return await strapi.services.proveedor.delete({ data, params });
  },

  async create(ctx) {
    const { data, productos } = ctx.request.body;

    if (!productos?.length) return ctx.badRequest('El proveedor debe suministrar al menos un producto.');

    const proveedor = await strapi.services.proveedor.create({ data });
    await Promise.all(productos.map(producto => crearProducto(proveedor.id, producto)));

    return { proveedor };
  },
  // listar productos del proveedor especificado
  async findProductosByProveedor(ctx) {
    const { id } = ctx.params;

    // Verificar si el proveedor existe
    const proveedor = await strapi.db.query('api::proveedor.proveedor').findOne({ where: { id } });
    if (!proveedor) return ctx.badRequest('El proveedor no existe.');

    // Obtener productos del proveedor
    const productos = await strapi.db.query('api::producto.producto').findMany({ where: { proveedor: id } });
    
    return { proveedor, productos };
  },

  // 🔹 Función para consultar informacion específica de un proveedor junto a sus productos
  async findProveedorByProductos(ctx) {
    const { id } = ctx.params;

    // Verificar si el proveedor existe
    const proveedor = await strapi.db.query('api::proveedor.proveedor').findOne({ where: { id } });
    if (!proveedor) return ctx.badRequest('El proveedor no existe.');

    // Obtener productos del proveedor
    const productos = await strapi.db.query('api::producto.producto').findMany({ where: { proveedor: id } });

    return { proveedor, productos };
  }
}));

// Función para crear productos vinculados al proveedor
async function crearProducto(idProveedor, productoData) {
  return await strapi.db.query('api::producto.producto').create({ data: { proveedor: idProveedor, ...productoData } });
}