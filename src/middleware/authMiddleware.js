const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Limpando espaços extras
  req.body.name = name?.trim();
  req.body.email = email?.trim().toLowerCase();

  // 2. Validação
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "A senha deve ter 6+ caracteres." });
  }

  // Se estiver tudo OK, o next() autoriza ir para o Controller
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // 1. Limpando espaços extras
  req.body.email = email?.trim().toLowerCase();
  req.body.name = password?.trim();

  // 2. Validação
  if (!email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "E-mail ou senha incorretos" });
  }

  // Se estiver tudo OK, o next() autoriza ir para o Controller
  next();
};

module.exports = { validateRegister, validateLogin };