const pool = require('../config/database');

const createProduct = async (req, res) => {
  // Pegamos os dados que o formulário no React vai enviar
  const { name, price, stock, category, gender, color, size } = req.body; // Desestruturação do body (corpo) da requisição feita no front

  try {
    const query = `
      INSERT INTO products (name, price, stock, category, gender, color, size)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `; // O RETURNING * pede para o banco devolver o produto criado (com o ID gerado)
    
    const values = [name, price, stock, category, gender, color, size];
    const result = await pool.query(query, values);

    // Retornamos o produto criado (com ID e Data gerados pelo banco)
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    console.error("Erro no banco:", error);
    res.status(500).json({ error: "Erro ao cadastrar produto" });
  }
};

module.exports = { createProduct }; // Exportamos a função de criar produto para usarmos em outros arquivos