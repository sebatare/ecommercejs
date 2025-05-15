const ProductService = require('../../src/application/services/ProductService');
const NotFoundError = require('../../src/domain/errors/NotFoundError');

describe('productService', () => {

    describe('getById', () => {
        it('Debe retornar un producto si existe', async () => {
            const producto = { id: 1, name: 'Producto 1' };

            const mockRepository = {
                findById: jest.fn().mockResolvedValue(producto)
            };

            const service = new ProductService(mockRepository);

            const result = await service.getById(1);

            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(result).toEqual(producto);
        });

        it('Debe lanzar NotFoundError si el producto no existe', async () => {
            const mockRepository = {
                findById: jest.fn().mockResolvedValue(null)
            };

            const service = new ProductService(mockRepository);

            await expect(service.getById(999)).rejects.toThrow(NotFoundError);
            expect(mockRepository.findById).toHaveBeenCalledWith(999);
        });
    });
    // Test para el método create
    it('create debe guardar un nuevo producto', async () => {
        const input = { name: 'Nuevo', price: 100, stock: 5 };
        const savedProduct = { id: 1, ...input };

        const mockRepository = {
            create: jest.fn().mockResolvedValue(savedProduct)
        };

        const service = new ProductService(mockRepository);

        const result = await service.create(input);

        expect(mockRepository.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(savedProduct);
    });
    // Test para el método update
    it('update debe actualizar un producto existente', async () => {
        const input = { name: 'Actualizado', price: 150, stock: 10 };
        const updatedProduct = { id: 1, ...input };

        const mockRepository = {
            update: jest.fn().mockResolvedValue(updatedProduct)
        };

        const service = new ProductService(mockRepository);

        const result = await service.update(1, input);

        expect(mockRepository.update).toHaveBeenCalledWith(1, input);
        expect(result).toEqual(updatedProduct);
    });

    // Test para el método getAll
    it('getAll debe retornar productos desde el repositorio', async () => {
        const mockProducts = [
            { id: 1, name: 'Producto 1', description: 'Desc', price: 100, stock: 10 },
            { id: 2, name: 'Producto 2', description: 'Desc', price: 200, stock: 20 }
        ];

        // Creamos un mock manual del repositorio
        const mockRepository = {
            findAll: jest.fn().mockResolvedValue(mockProducts)
        };

        const productService = new ProductService(mockRepository);

        const result = await productService.getAll();

        expect(mockRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockProducts);
    });

    // Test para el método delete
    it('delete debe eliminar un producto existente', async () => {
        const mockRepository = {
            delete: jest.fn().mockResolvedValue()
        };

        const productService = new ProductService(mockRepository);

        await productService.delete(1);

        expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });


});
