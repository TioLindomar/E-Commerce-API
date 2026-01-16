// * É o arquivo que "responde as ligações" do front-end

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// * Middlewares
app.use(cors());
app.use(express.json()); // Ensina o Express a ler JSON. Sem isso, o req.body lá no Controller seria sempre undefined

// Rota de teste
app.get("/", (req, res) => {
  res.send("Backend do E-commerce rodando com sucesso!");
});

// * Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// * Montagem de rotas
app.use('/products', productRoutes); // 3 - Isso significa que a rota "/" do productRoutes na verdade se torna localhost:3000/products/. É como se você estivesse criando uma pasta virtual para organizar as URLs.
app.use('/users', authRoutes);

// * Vinculação a uma porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});