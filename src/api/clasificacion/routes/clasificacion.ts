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
            path: '/clasificacion/categoria/:id/productos',
            handler: 'clasificacion.findProductosByCategoria',
            config: {
              policies: [],
              middlewares: [],
            },
        }, 
        {
            method: 'GET',
            path: '/clasificacion/productos-con-categorias',
            handler: 'clasificacion.findProductosConCategorias',
            config: {
              policies: [],
              middlewares: [],
            },
          },
          {
            method: 'GET',
            path: '/clasificacion/productos-by-categoria/:id',
            handler: 'clasificacion.findProductosByCategoria',
            config: {
              policies: [],
              auth: false,
            },
          },
    ]
}