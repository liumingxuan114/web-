const { query } = require('../db-config-mysql');
const bcrypt = require('bcryptjs');

class UserModelMysql {
    // 创建用户
    static async createUser(userData) {
        try {
            const { username, email, password, firstName, lastName } = userData;

            // 密码加密
            const passwordHash = await bcrypt.hash(password, 10);

            const result = await query(
                `INSERT INTO users (username, email, password_hash, first_name, last_name) 
                 VALUES (?, ?, ?, ?, ?)`,
                [username, email, passwordHash, firstName, lastName]
            );

            return result.insertId;
        } catch (error) {
            console.error('创建用户失败:', error);
            throw error;
        }
    }

    // 根据用户名查找用户
    static async findByUsername(username) {
        try {
            const rows = await query(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            return rows[0];
        } catch (error) {
            console.error('查找用户失败:', error);
            throw error;
        }
    }

    // 根据邮箱查找用户
    static async findByEmail(email) {
        try {
            const rows = await query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            console.error('查找用户失败:', error);
            throw error;
        }
    }

    // 根据ID查找用户
    static async findById(id) {
        try {
            const rows = await query(
                'SELECT id, username, email, first_name, last_name, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('查找用户失败:', error);
            throw error;
        }
    }

    // 验证密码
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // 检查用户名或邮箱是否已存在
    static async checkUserExists(username, email) {
        try {
            const rows = await query(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [username, email]
            );
            return rows.length > 0;
        } catch (error) {
            console.error('检查用户存在失败:', error);
            throw error;
        }
    }
}

module.exports = UserModelMysql;