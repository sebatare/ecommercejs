
//MOCK DE AUTENTICACIÓN
jest.mock('../../src/middleware/authenticate', () => (req, res, next) => next());


const request = require('supertest');
const express = require('express');
const createRoleRouter = require('../../src/infrastructure/routers/RoleRouter');

describe('DELETE /api/roles/:id', () => {
    it('debe responder con mensaje de rol eliminado', async () => {
        // Mock del servicio
        const mockService = {
            delete: jest.fn().mockResolvedValue()
        };

        const app = express();
        app.use(express.json());

        // Opcional: omite el middleware de autenticación
        app.use('/api/roles', createRoleRouter(mockService));

        const response = await request(app).delete('/api/roles/1');

        expect(mockService.delete).toHaveBeenCalledWith(1);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Rol eliminado' });
    });
});
