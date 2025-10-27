const bcrypt = require('bcryptjs');

module.exports = (db) => {
  return {
    async create(userData) {
      const { name, email, password, phone, company, address, role, vehicle_info } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO users (name, email, password, phone, company, address, role, vehicle_info)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, phone, company, address, role, vehicle_info, created_at
      `;
      
      const values = [name, email, hashedPassword, phone, company, address, role, vehicle_info];
      const result = await db.query(query, values);
      return result.rows[0];
    },
    
    async findByEmail(email) {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await db.query(query, [email]);
      return result.rows[0];
    },
    
    async findById(id) {
      const query = 'SELECT id, name, email, phone, company, address, role, vehicle_info, created_at FROM users WHERE id = $1';
      const result = await db.query(query, [id]);
      return result.rows[0];
    },
    
    async update(id, updateData) {
      const { name, phone, address, password } = updateData;
      let query, values;
      
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query = `
          UPDATE users 
          SET name = $1, phone = $2, address = $3, password = $4, updated_at = CURRENT_TIMESTAMP
          WHERE id = $5
          RETURNING id, name, email, phone, company, address, role, vehicle_info, created_at
        `;
        values = [name, phone, address, hashedPassword, id];
      } else {
        query = `
          UPDATE users 
          SET name = $1, phone = $2, address = $3, updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
          RETURNING id, name, email, phone, company, address, role, vehicle_info, created_at
        `;
        values = [name, phone, address, id];
      }
      
      const result = await db.query(query, values);
      return result.rows[0];
    },
    
    async getAll() {
      const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
      const result = await db.query(query);
      return result.rows;
    },
    
    async deleteByEmail(email) {
      const query = 'DELETE FROM users WHERE email = $1';
      const result = await db.query(query, [email]);
      return result.rowCount > 0;
    },
    
    async validatePassword(plainPassword, hashedPassword) {
      return await bcrypt.compare(plainPassword, hashedPassword);
    }
  };
};
