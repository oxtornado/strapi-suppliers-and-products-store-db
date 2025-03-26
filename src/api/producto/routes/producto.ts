/**
 * producto router
 */

import { factories } from '@strapi/strapi';

export default {
    routes: [
        {
            method: 'GET',
            path: '/producto',
            handler: 'producto.find',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/producto/:id',
            handler: 'producto.findOne',
            config: {
                policies: []
            }
        },
        {
            method: 'POST',
            path: '/producto',
            handler: 'producto.create',
            config: {
                policies: []
            }
        },
        {
            method: 'PUT',
            path: '/producto/:id',
            handler: 'producto.update',
            config: {
                policies: []
            }
        },
        {
            method: 'DELETE',
            path: '/producto/:id',
            handler: 'producto.delete',
            config: {
                policies: []
            }
        },
        {
            method: "GET",
            path: "/categoria/:id/productos",
            handler: "producto.findProductosByCategoria",
            config: {
                auth: false 
            },
        },
        {
            method: 'GET',
            path: '/categorias/:categorias/productos',
            handler: 'producto.findProductosByCategorias',
            config: {
                policies: []
            }
        }
    ]
}