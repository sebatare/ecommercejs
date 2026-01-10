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

    describe('createCart', () => {
        it('should create a cart with valid userId', async () => {
            const mockCart = { id: 1, userId: 1 };
            mockCartRepository.createCart.mockResolvedValue(mockCart);

            const result = await cartService.createCart(1);

            expect(result).toEqual(mockCart);
            expect(mockCartRepository.createCart).toHaveBeenCalledWith(1);
            expect(mockCartRepository.createCart).toHaveBeenCalledTimes(1);
        });

        it('should throw CartValidationError if userId is missing', async () => {
            await expect(cartService.createCart(null)).rejects.toThrow(CartValidationError);
            expect(mockCartRepository.createCart).not.toHaveBeenCalled();
        });

        it('should throw CartValidationError if userId is undefined', async () => {
            await expect(cartService.createCart(undefined)).rejects.toThrow(CartValidationError);
        });

        it('should handle PostgreSQL NOT NULL error', async () => {
            const error = { code: '23502', column: 'user_id' };
            mockCartRepository.createCart.mockRejectedValue(error);

            await expect(cartService.createCart(1)).rejects.toThrow(CartValidationError);
        });

        it('should handle PostgreSQL FK violation error', async () => {
            const error = { code: '23503', constraint: 'fk_user' };
            mockCartRepository.createCart.mockRejectedValue(error);

            await expect(cartService.createCart(999)).rejects.toThrow(CartValidationError);
        });

        it('should handle PostgreSQL Unique violation error', async () => {
            const error = { code: '23505' };
            mockCartRepository.createCart.mockRejectedValue(error);

            await expect(cartService.createCart(1)).rejects.toThrow();
        });
    });

    describe('getCart', () => {
        it('should return existing cart', async () => {
            const mockCart = { id: 1, userId: 1, items: [] };
            mockCartRepository.getCart.mockResolvedValue(mockCart);

            const result = await cartService.getCart(1);

            expect(result).toEqual(mockCart);
            expect(mockCartRepository.getCart).toHaveBeenCalledWith(1);
        });

        it('should throw NotAuthorizedError if userId is missing', async () => {
            await expect(cartService.getCart(null)).rejects.toThrow(NotAuthorizedError);
        });

        it('should create new cart if getCart fails', async () => {
            const newCart = { id: 2, userId: 1, items: [] };
            mockCartRepository.getCart.mockRejectedValue(new Error('Not found'));
            mockCartRepository.createCart.mockResolvedValue(newCart);

            const result = await cartService.getCart(1);

            expect(result).toEqual(newCart);
            expect(mockCartRepository.createCart).toHaveBeenCalledWith(1);
        });

        it('should return empty items array when cart is created as fallback', async () => {
            const newCart = { id: 2, userId: 1 };
            mockCartRepository.getCart.mockRejectedValue(new Error('Not found'));
            mockCartRepository.createCart.mockResolvedValue(newCart);

            const result = await cartService.getCart(1);

            expect(result.items).toEqual([]);
        });
    });

    describe('getAllCarts', () => {
        it('should return all carts', async () => {
            const mockCarts = [
                { id: 1, userId: 1 },
                { id: 2, userId: 2 }
            ];
            mockCartRepository.getAllCarts.mockResolvedValue(mockCarts);

            const result = await cartService.getAllCarts();

            expect(result).toEqual(mockCarts);
            expect(mockCartRepository.getAllCarts).toHaveBeenCalledTimes(1);
        });

        it('should throw error if repository fails', async () => {
            mockCartRepository.getAllCarts.mockRejectedValue(new Error('DB error'));

            await expect(cartService.getAllCarts()).rejects.toThrow();
        });
    });

    describe('updateItems', () => {
        it('should update cart items with valid cartId', async () => {
            const updates = [{ productId: 1, quantity: 2 }];
            mockCartRepository.updateCartItems.mockResolvedValue(undefined);

            await cartService.updateItems(1, updates);

            expect(mockCartRepository.updateCartItems).toHaveBeenCalledWith(1, updates);
        });

        it('should throw error if cartId is missing', async () => {
            const updates = [{ productId: 1, quantity: 2 }];

            await expect(cartService.updateItems(null, updates)).rejects.toThrow();
            expect(mockCartRepository.updateCartItems).not.toHaveBeenCalled();
        });
    });

    describe('clearCart', () => {
        it('should clear cart items', async () => {
            mockCartRepository.clearCart.mockResolvedValue(undefined);

            await cartService.clearCart(1);

            expect(mockCartRepository.clearCart).toHaveBeenCalledWith(1);
        });

        it('should pass userId to repository', async () => {
            mockCartRepository.clearCart.mockResolvedValue(undefined);

            await cartService.clearCart(5);

            expect(mockCartRepository.clearCart).toHaveBeenCalledWith(5);
        });
    });
});
