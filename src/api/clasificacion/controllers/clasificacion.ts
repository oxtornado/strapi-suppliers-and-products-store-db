/**
 * clasificacion controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::clasificacion.clasificacion', ({ strapi }) => ({
    async findOne(ctx) {
        const { query, params } = ctx
        return await strapi.services.clasificacion.findOne({ query, params })
    },

    async findMany(ctx) {
        const { query, params } = ctx
        return await strapi.services.clasificacion.find({ query, params })
    },

    async update(ctx) {
        const { data, params } = ctx
        return await strapi.services.clasificacion.update({ data, params })
    },

    async delete(ctx) {
        const { data, params } = ctx
        return await strapi.services.clasificacion.delete({ data, params })
    },

    async create(ctx) {
        const { data, params } = ctx
        return await strapi.services.clasificacion.create({ data, params })
    },

    // funcion para consultar las categorias que tiene el producto
    async findCategoriasByProducto(ctx) {
        const { id } = ctx.params;

        // verificar si el producto existe
        const producto = await strapi.db.query('api::producto.producto').findOne({ where: { id } });
        if (!producto) return ctx.badRequest('El producto no existe.');

        // obtener las categorias que tiene el producto
        const categorias = await strapi.db.query('api::clasificacion.clasificacion').findMany({ where: { idProducto: id } });

        return { producto, categorias };
    }
}))
