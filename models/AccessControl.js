module.exports = (db) => {
  return {
    async get() {
      const query = 'SELECT * FROM access_control ORDER BY id DESC LIMIT 1';
      const result = await db.query(query);
      return result.rows[0] || {
        post_loads_enabled: true,
        banners: {},
        pages: {},
        user_access: {}
      };
    },
    
    async update(updateData) {
      const { post_loads_enabled, banners, pages, user_access } = updateData;
      
      // Check if a record exists
      const existing = await this.get();
      
      if (existing.id) {
        // Update existing record
        const query = `
          UPDATE access_control 
          SET post_loads_enabled = $1, banners = $2, pages = $3, user_access = $4, updated_at = CURRENT_TIMESTAMP
          WHERE id = $5
          RETURNING *
        `;
        
        const values = [post_loads_enabled, banners, pages, user_access, existing.id];
        const result = await db.query(query, values);
        return result.rows[0];
      } else {
        // Create new record
        const query = `
          INSERT INTO access_control (post_loads_enabled, banners, pages, user_access)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        
        const values = [post_loads_enabled, banners, pages, user_access];
        const result = await db.query(query, values);
        return result.rows[0];
      }
    }
  };
};
