module.exports = (db) => {
  return {
    async create(loadData) {
      const { origin, destination, date, cargo_type, weight, notes, shipper_id } = loadData;
      
      // Generate a unique reference
      const ref = `LOAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Calculate expiry date (7 days from now)
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + 7);
      
      const query = `
        INSERT INTO loads (ref, origin, destination, date, expires_at, cargo_type, weight, notes, shipper_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const values = [ref, origin, destination, date, expires_at, cargo_type, weight, notes, shipper_id];
      const result = await db.query(query, values);
      return result.rows[0];
    },
    
    async getAll(filters = {}) {
      let query = `
        SELECT l.*, u.name as shipper 
        FROM loads l
        JOIN users u ON l.shipper_id = u.id
        WHERE 1=1
      `;
      const values = [];
      let paramIndex = 1;
      
      if (filters.origin) {
        query += ` AND l.origin ILIKE $${paramIndex}`;
        values.push(`%${filters.origin}%`);
        paramIndex++;
      }
      
      if (filters.destination) {
        query += ` AND l.destination ILIKE $${paramIndex}`;
        values.push(`%${filters.destination}%`);
        paramIndex++;
      }
      
      if (filters.shipper_id) {
        query += ` AND l.shipper_id = $${paramIndex}`;
        values.push(filters.shipper_id);
        paramIndex++;
      }
      
      query += ' ORDER BY l.created_at DESC';
      
      const result = await db.query(query, values);
      return result.rows;
    },
    
    async findById(id) {
      const query = 'SELECT * FROM loads WHERE id = $1';
      const result = await db.query(query, [id]);
      return result.rows[0];
    },
    
    async update(id, updateData) {
      const { origin, destination, date, cargo_type, weight, notes } = updateData;
      
      const query = `
        UPDATE loads 
        SET origin = $1, destination = $2, date = $3, cargo_type = $4, weight = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `;
      
      const values = [origin, destination, date, cargo_type, weight, notes, id];
      const result = await db.query(query, values);
      return result.rows[0];
    },
    
    async delete(id) {
      const query = 'DELETE FROM loads WHERE id = $1';
      const result = await db.query(query, [id]);
      return result.rowCount > 0;
    }
  };
};
