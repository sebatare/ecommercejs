// src/application/services/UserService.js

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async findAll() {
        
        return this.userRepository.findAll();
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }

    async update(id, updatedData, currentUser) {
        // La validación de permisos se realiza aquí.
        if (currentUser.role !== 'admin' && currentUser.id !== id) {
            throw new Error('No tiene permiso para actualizar este usuario');
        }

        // Si la validación pasa, el servicio llama al repositorio.
        // El repositorio simplemente ejecuta la operación de base de datos.
        return this.userRepository.update(id, updatedData);
    }

    // Agrega aquí otros métodos de lógica de usuario si es necesario
    // Por ejemplo: async delete(id, currentUser) { ... }
}

module.exports = UserService;