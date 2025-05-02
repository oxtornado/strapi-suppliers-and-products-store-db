/**
 * clasificacion controller
 */
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::clasificacion.clasificacion', ({ strapi }) => ({
  async findOne(ctx) {
    const { params, query } = ctx;
    return await strapi.entityService.findOne('api::clasificacion.clasificacion', params.id, {
      ...query,
      populate: ['producto', 'categoria'],
    });
  },

  async findMany(ctx) {
    const { query } = ctx;
    return await strapi.entityService.findMany('api::clasificacion.clasificacion', {
      ...query,
      populate: ['producto', 'categoria'],
    });
  },

  async update(ctx) {
    const { data, params } = ctx.request.body;
    return await strapi.entityService.update('api::clasificacion.clasificacion', params.id, {
      data,
    });
  },

  async delete(ctx) {
    const { params } = ctx;
    return await strapi.entityService.delete('api::clasificacion.clasificacion', params.id);
  },

  async create(ctx) {
    const { data } = ctx.request.body;
    return await strapi.entityService.create('api::clasificacion.clasificacion', {
      data,
    });
  },

  async findProductosByCategoria(ctx) {
    const { id } = ctx.params;

    console.log('🟡 Entrando a findProductosByCategoria con id:', id);

    try {
      const clasificaciones = await strapi.db.query('api::clasificacion.clasificacion').findMany({
        where: {
          categoria: {
            id: parseInt(id),
          },
        },
        populate: ['producto'],
      });

      console.log('🟢 Clasificaciones encontradas:', clasificaciones.length);

      const productos = clasificaciones
        .map(cl => cl.producto)
        .filter(Boolean);

      console.log('🔵 Productos después de filtrar nulos:', productos.length);

      const productosUnicos = Array.from(
        new Map(productos.map(p => [p.id, p])).values()
      );

      console.log('🟣 Productos únicos:', productosUnicos.length);

      const categoria = await strapi.db.query('api::categoria.categoria').findOne({
        where: {
          id: parseInt(id),
        },
        populate: ['productos'],
      });

      return { "la categoria": categoria.nombreCategoria, "tiene asociados los productos": productosUnicos };
    } catch (error) {
      console.error('🔴 Error en findProductosByCategoria:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },

  async findProductosConCategorias(ctx) {
    try {
      console.log('🟡 Entrando a findProductosConCategorias');

      const clasificaciones = await strapi.db.query('api::clasificacion.clasificacion').findMany({
        populate: ['producto', 'categoria'],
      });

      console.log('🟢 Clasificaciones encontradas:', clasificaciones.length);

      const mapaProductos = new Map();

      for (const cl of clasificaciones) {
        const producto = cl.producto;
        const categoria = cl.categoria;

        if (!producto || !categoria) continue;

        if (!mapaProductos.has(producto.id)) {
          mapaProductos.set(producto.id, {
            producto: producto,
            categorias: [categoria],
          });
        } else {
          mapaProductos.get(producto.id).categorias.push(categoria);
        }
      }

      const resultado = Array.from(mapaProductos.values()).map(entry => ({
        "el producto": entry.producto.nombreProducto,
        "tiene asociados las categorias": entry.categorias,
      }));

      console.log('🔵 Productos con categorías asociadas:', resultado.length);

      return resultado;
    } catch (error) {
      console.error('🔴 Error en findProductosConCategorias:', error);
      ctx.throw(500, 'Error interno del servidor');
    }
  },
}));
