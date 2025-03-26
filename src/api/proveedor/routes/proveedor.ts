/**
 * proveedor router
 */

import { factories } from '@strapi/strapi';
import { Routes } from 'react-router-dom';

export default {
    routes: [
        {
            method: 'GET',
            path: '/proveedor',
            handler: 'proveedor.find',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/proveedor/:id',
            handler: 'proveedor.findOne',
            config: {
                policies: []
            }
        },
        {
            method: 'POST',
            path: '/proveedor',
            handler: 'proveedor.create',
            config: {
                policies: []
            }
        },
        {
            method: 'PUT',
            path: '/proveedor/:id',
            handler: 'proveedor.update',
            config: {
                policies: []
            }
        },
        {
            method: 'DELETE',
            path: '/proveedor/:id',
            handler: 'proveedor.delete',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/proveedor/productos/:id',
            handler: 'proveedor.findProductosByProveedor',
            config: {
                policies: []
            }
        },
        {
            method: 'GET',
            path: '/proveedor/:id/productos',
            handler: 'proveedor.findProveedorByProductos',
            config: {
                policies: []
            }
        }
    ]
}