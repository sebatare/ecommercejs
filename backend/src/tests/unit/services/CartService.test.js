const CartService = require('../../../application/services/CartService');
const CartValidationError = require('../../../domain/errors/cart/CartValidationError');
const NotAuthorizedError = require('../../../domain/errors/NotAuthorizedError');

describe('CartService - Unit Tests', () => {
    let cartService;
    let mockCartRepository;

    beforeEach(() => {
        // Mock del repositorio
        mockCartRepository = {
            createCart: jest.fn(),
            getCart: jest.fn(),
            getAllCarts: jest.fn(),
            updateCartItems: jest.fn(),
            clearCart: jest.fn(),
        };

        cartService = new CartService(mockCartRepository);
    });

    describe('Creación de carrito', () => {
        it('Crear carrito con userId válido', async () => {
            const mockCart = { id: 1, userId: 1 };
            mockCartRepository.createCart.mockResolvedValue(mockCart);

            const result = await cartService.createCart(1);

            expect(result).toEqual(mockCart);
            expect(mockCartRepository.createCart).toHaveBeenCalledWith(1);
            expect(mockCartRepository.createCart).toHaveBeenCalledTimes(1);
        });

        it('Crear carrito con userId nulo', async () => {
            await expect(cartService.createCart(null)).rejects.toThrow(CartValidationError);
            expect(mockCartRepository.createCart).not.toHaveBeenCalled();
        });

        it('Crear carrito con userId indefinido', async () => {
            await expect(cartService.createCart(undefined)).rejects.toThrow(CartValidationError);
        });

        it('Manejar error de PostgreSQL NOT NULL', async () => {
            const error = { code: '23502', column: 'user_id' };
            mockCartRepository.createCart.mockRejectedValue(error);

            await expect(cartService.createCart(1)).rejects.toThrow(CartValidationError);
        });

        it('Manejar error de PostgreSQL FK violation', async () => {
            const error = { code: '23503', constraint: 'fk_user' };
            mockCartRepository.createCart.mockRejectedValue(error);

            await expect(cartService.createCart(999)).rejects.toThrow(CartValidationError);
        });

        it('Manejar error de PostgreSQL Unique violation', async () => {
            const error = { code: '23505' };
            mockCartRepository.createCart.mockRejectedValue(error);

            await expect(cartService.createCart(1)).rejects.toThrow();
        });
    });

    describe('Obtener carrito', () => {
        it('Obtener carrito existente', async () => {
            const mockCart = { id: 1, userId: 1, items: [] };
            mockCartRepository.getCart.mockResolvedValue(mockCart);

            const result = await cartService.getCart(1);

            expect(result).toEqual(mockCart);
            expect(mockCartRepository.getCart).toHaveBeenCalledWith(1);
        });

        it('Lanzar error de autorización al obtener carrito', async () => {
            await expect(cartService.getCart(null)).rejects.toThrow(NotAuthorizedError);
        });

        it('Obtener carrito vacío al crear nuevo carrito como fallback', async () => {
            const newCart = { id: 2, userId: 1 };
            mockCartRepository.getCart.mockRejectedValue(new Error('Not found'));
            mockCartRepository.createCart.mockResolvedValue(newCart);

            const result = await cartService.getCart(1);

            expect(result.items).toEqual([]);
        });
    });

    describe('Obtener todos los carritos', () => {
        it('Obtener todos los carritos', async () => {
            const mockCarts = [
                { id: 1, userId: 1 },
                { id: 2, userId: 2 }
            ];
            mockCartRepository.getAllCarts.mockResolvedValue(mockCarts);

            const result = await cartService.getAllCarts();

            expect(result).toEqual(mockCarts);
            expect(mockCartRepository.getAllCarts).toHaveBeenCalledTimes(1);
        });

        it('Manejar error de base de datos al obtener todos los carritos', async () => {
            mockCartRepository.getAllCarts.mockRejectedValue(new Error('DB error'));

            await expect(cartService.getAllCarts()).rejects.toThrow();
        });
    });

    describe('Actualizar items del carrito', () => {
        it('Actualizar items del carrito con ID válido', async () => {
            const updates = [{ productId: 1, quantity: 2 }];
            mockCartRepository.updateCartItems.mockResolvedValue(undefined);

            await cartService.updateItems(1, updates);

            expect(mockCartRepository.updateCartItems).toHaveBeenCalledWith(1, updates);
        });

        it('Lanzar error de validación al actualizar items del carrito', async () => {
            const updates = [{ productId: 1, quantity: 2 }];

            await expect(cartService.updateItems(null, updates)).rejects.toThrow();
            expect(mockCartRepository.updateCartItems).not.toHaveBeenCalled();
        });
    });

    describe('Limpiar carrito', () => {
        it('Entrega carrito limpio', async () => {
            mockCartRepository.clearCart.mockResolvedValue(undefined);

            await cartService.clearCart(1);

            expect(mockCartRepository.clearCart).toHaveBeenCalledWith(1);
        });
        it('Manejar error al limpiar carrito', async () => {
            mockCartRepository.clearCart.mockRejectedValue(new Error('DB error'));

            await expect(cartService.clearCart(1)).rejects.toThrow('DB error');
        });
    });
});
