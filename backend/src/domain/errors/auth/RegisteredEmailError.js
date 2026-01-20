class RegisteredEmailError extends Error {
    constructor(email) {
        super(`El email ${email} ya está registrado`);
        this.name = 'RegisteredEmailError';
        this.email = email;
    }
}

module.exports = RegisteredEmailError;  // Default export, not named export