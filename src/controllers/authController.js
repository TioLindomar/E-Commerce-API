// * Esse arquivo são as "regras de negócio" da autentificação. É aqui que a lógica realmente acontece

const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

// * Cadastrar usuário
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validação
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha deve ter no mínimo 6 caracteres djanho." });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "E-mail inválido." });
  }

  try {
    // 1. Gerar o Hash da senha (Segurança!)
    const saltRounds = 10; // Define um nível de segurança de 10 rodadas (o padrão da indústria).
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (name, email, password) VALUES
        ($1, $2, $3)
        RETURNING *; `;

    const values = [name, email, hashedPassword];
    const result = await pool.query(query, values);

    const user = result.rows[0];

    const token = jsonwebtoken.sign(
      { id: user.id },
      process.env.JWT_SECRET, // Uma senha mestre que fica no seu .env
      { expiresIn: "1d" } // O token expira em 1 dia
    );

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    // Tratar erro de e-mail duplicado (Unique Constraint do Postgres)
    if (error.code === "23505") {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }

    console.error("Erro no banco:", error);
    res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
  }
};

// * Login do usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar o usuário pelo e-mail
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    // 2. Verificar se o usuário existe
    if (result.rows.length === 0) {
      // Não diga "E-mail não encontrado", pois isso ajuda hackers a descobrirem e-mails válidos.
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    const user = result.rows[0];

    // 3. Comparar a senha digitada com o Hash do banco
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    // 4. Se chegou aqui, a senha está correta! Gerar o Token.
    // O token guarda o ID do usuário para sabermos quem ele é nas próximas requisições.
    const token = jsonwebtoken.sign(
      { id: user.id },
      process.env.JWT_SECRET, // Uma senha mestre que fica no seu .env
      { expiresIn: "1d" } // O token expira em 1 dia
    );

    // 5. Retornar os dados (sem a senha!) e o token
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

module.exports = { registerUser, loginUser };
