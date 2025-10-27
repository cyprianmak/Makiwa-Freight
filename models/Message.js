module.exports = (db) => {
  return {
    async create(messageData) {
      const { sender_id, recipient_id, sender_email, body } = messageData;
      
      const query = `
        INSERT INTO messages (sender_id, recipient_id, sender_email, body)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const values = [sender_id, recipient_id, sender_email, body];
      const result = await db.query(query, values);
      return result.rows[0];
    },
    
    async getAll() {
      const query = 'SELECT * FROM messages ORDER BY created_at DESC';
      const result = await db.query(query);
      return result.rows;
    },
    
    async delete(id) {
      const query = 'DELETE FROM messages WHERE id = $1';
      const result = await db.query(query, [id]);
      return result.rowCount > 0;
    }
  };
};
