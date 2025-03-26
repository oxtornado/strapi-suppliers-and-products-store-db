/**
 * clasificacion router
 */

import { factories } from '@strapi/strapi';

export default {
    routes: [
        {
            method: 'GET',
            path: '/clasificacion',
            handler: 'clasificacion.find',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/clasificacion/:id',
            handler: 'clasificacion.findOne',
            config: {
                policies: []
            }
        },
        {
            method: 'POST',
            path: '/clasificacion',
            handler: 'clasificacion.create',
            config: {
                policies: []
            }
        },
        {
            method: 'PUT',
            path: '/clasificacion/:id',
            handler: 'clasificacion.update',
            config: {
                policies: []
            }
        },
        {
            method: 'DELETE',
            path: '/clasificacion/:id',
            handler: 'clasificacion.delete',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/producto/:id/categorias',
            handler: 'clasificacion.findCategoriasByProducto',
            config: {
                auth: false
            }
        }
    ]
}