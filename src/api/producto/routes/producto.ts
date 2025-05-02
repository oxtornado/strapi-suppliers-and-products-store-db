/**
 * producto router
 */

import { factories } from '@strapi/strapi';
import * as producto from '../controllers/producto';

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
            path: "/producto/categoria/:id",
            handler: "producto.findCategoriasByProducto",
            config: {
                auth: false 
            },
        },
        {
            method: "GET",
            path: "/producto/proveedor/:id",
            handler: "producto.findProductosByProveedor",
            config: {
                auth: false 
            },
        },
    ]
}