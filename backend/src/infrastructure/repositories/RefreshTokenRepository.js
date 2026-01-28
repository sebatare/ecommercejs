const pool = require('../db/pool');
const crypto = require('crypto');

class RefreshTokenRepository {
    constructor() {
        this.tableName = 'refresh_tokens';
    }

    /**
     * Genera un hash del token (para almacenar de forma segura)
     */
    _hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Crea un nuevo refresh token en la BD
     */
    async create(userId, expiresAt) {
        // Generar token único
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = this._hashToken(token);

        const res = await pool.query(
            `INSERT INTO ${this.tableName} (user_id, token_hash, expires_at, revoked)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, expires_at, created_at`,
            [userId, tokenHash, expiresAt, false]
        );

        if (res.rows.length === 0) {
            throw new Error('Error creando refresh token');
        }

        return {
            id: res.rows[0].id,
            userId: res.rows[0].user_id,
            token, // Devolvemos el token sin hashear para el cliente
            expiresAt: res.rows[0].expires_at,
            createdAt: res.rows[0].created_at
        };
    }

    /**
     * Valida si un refresh token existe y es válido
     */
    async validateToken(userId, token) {
        const tokenHash = this._hashToken(token);

        const res = await pool.query(
            `SELECT id, user_id, expires_at, revoked
             FROM ${this.tableName}
             WHERE user_id = $1 AND token_hash = $2`,
            [userId, tokenHash]
        );

        if (res.rows.length === 0) {
            return null;
        }

        const refreshToken = res.rows[0];

        // Verificar si está revocado
        if (refreshToken.revoked) {
            return null;
        }

        // Verificar si expiró
        if (new Date() > new Date(refreshToken.expires_at)) {
            return null;
        }

        return refreshToken;
    }

    /**
     * Revoca un refresh token
     */
    async revoke(tokenId) {
        const res = await pool.query(
            `UPDATE ${this.tableName} SET revoked = true WHERE id = $1 RETURNING *`,
            [tokenId]
        );

        return res.rows[0] || null;
    }

    /**
     * Revoca todos los tokens de un usuario (logout en todos los dispositivos)
     */
    async revokeAllForUser(userId) {
        const res = await pool.query(
            `UPDATE ${this.tableName} SET revoked = true WHERE user_id = $1 AND revoked = false RETURNING *`,
            [userId]
        );

        return res.rows;
    }

    /**
     * Limpia los tokens expirados de la BD
     */
    async cleanExpiredTokens() {
        const res = await pool.query(
            `DELETE FROM ${this.tableName} WHERE expires_at < NOW() RETURNING id`
        );

        return res.rows.length;
    }

    /**
     * Obtiene todos los tokens válidos de un usuario
     */
    async findValidTokensByUserId(userId) {
        const res = await pool.query(
            `SELECT id, user_id, expires_at, created_at
             FROM ${this.tableName}
             WHERE user_id = $1 AND revoked = false AND expires_at > NOW()
             ORDER BY created_at DESC`,
            [userId]
        );

        return res.rows;
    }
}

module.exports = RefreshTokenRepository;
