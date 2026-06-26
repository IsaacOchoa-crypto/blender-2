import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener rutas de directorio en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Render asigna dinámicamente un puerto en la variable de entorno PORT
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta "dist" (donde Vite pone el build final)
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir cualquier otra ruta al index.html (importante para React Router si se usa)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
