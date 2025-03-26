import { factories } from '@strapi/strapi';

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
    const { proveedor, categorias, ...productoData } = ctx.request.body;

    if (!proveedor) return ctx.badRequest('El proveedor es obligatorio.');
    if (!await proveedorValido(proveedor)) return ctx.badRequest('El proveedor no existe.');
    if (!categorias?.length) return ctx.badRequest('El producto debe tener al menos una categoría.');

    const producto = await strapi.db.query('api::producto.producto').create({ data: { proveedor, ...productoData } });
    await vincularCategorias(producto.id, categorias);

    return { producto };
  },
  // 🔹 Funcion para consultar productos con mas de una categoría
  async findProductosByCategorias(ctx) {
    const { categorias } = ctx.params;

    // Verificar si las categorías existen
    const categoriasExistentes = await Promise.all(
      categorias.map(id => strapi.db.query('api::clasificacion.clasificacion').findOne({ where: { id } }))
    );
    const categoriasNoExistentes = categorias.filter(id => !categoriasExistentes.find(categoria => categoria.id === id));
    if (categoriasNoExistentes.length) return ctx.badRequest('Las categorías no existen.');

    // Obtener productos con las categorías
    const productos = await strapi.db.query('api::producto.producto').findMany({ where: { categorias: { id: categorias } } });

    return { categorias, productos };
  },
  // 🔹 Función para consultar productos con una categoría específica
  async findProductosByCategoria(ctx) {
    const { id } = ctx.params;

    // Verificar si la categoría existe
    const categoria = await strapi.db.query('api::clasificacion.clasificacion').findOne({ where: { id } });
    if (!categoria) return ctx.badRequest('La categoría no existe.');

    // Obtener productos con la categoría
    const productos = await strapi.db.query('api::producto.producto').findMany({ where: { categorias: { id } } });

    return { categoria, productos };
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