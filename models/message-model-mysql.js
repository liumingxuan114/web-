const { query } = require('../db-config-mysql');

class MessageModel {
    // 获取所有留言
    static async getAllMessages() {
        try {
            const results = await query(
                'SELECT * FROM messages ORDER BY timestamp DESC'
            );
            return results;
        } catch (error) {
            console.error('获取留言失败:', error);
            throw error;
        }
    }

    // 创建留言
    static async createMessage(author, content, userId = null) {
        try {
            const result = await query(
                'INSERT INTO messages (author, content, user_id) VALUES (?, ?, ?)',
                [author, content, userId]
            );
            return result.insertId;
        } catch (error) {
            console.error('创建留言失败:', error);
            throw error;
        }
    }

    // 根据用户ID获取留言
    static async getMessagesByUserId(userId) {
        try {
            const results = await query(
                'SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp DESC',
                [userId]
            );
            return results;
        } catch (error) {
            console.error('获取用户留言失败:', error);
            throw error;
        }
    }

    // 删除留言
    static async deleteMessage(messageId) {
        try {
            const result = await query(
                'DELETE FROM messages WHERE id = ?',
                [messageId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('删除留言失败:', error);
            throw error;
        }
    }

    // 获取留言统计
    static async getMessageStats() {
        try {
            const totalResult = await query('SELECT COUNT(*) as total FROM messages');
            const todayResult = await query(
                'SELECT COUNT(*) as today FROM messages WHERE DATE(timestamp) = CURDATE()'
            );

            return {
                total: totalResult[0].total,
                today: todayResult[0].today
            };
        } catch (error) {
            console.error('获取留言统计失败:', error);
            throw error;
        }
    }

    // 搜索留言
    static async searchMessages(keyword) {
        try {
            const searchTerm = `%${keyword}%`;
            const results = await query(
                'SELECT * FROM messages WHERE author LIKE ? OR content LIKE ? ORDER BY timestamp DESC',
                [searchTerm, searchTerm]
            );
            return results;
        } catch (error) {
            console.error('搜索留言失败:', error);
            throw error;
        }
    }
}

module.exports = MessageModel;