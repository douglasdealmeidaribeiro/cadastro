import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`API rodando na porta ${port}.`);
    });
  } catch (error) {
    console.error('Nao foi possivel iniciar a API:', error.message);
    process.exit(1);
  }
}

startServer();
