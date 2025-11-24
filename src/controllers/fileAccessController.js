import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'files'); 

// Verificar que el usuario esté autenticado
export const serveProtectedFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(UPLOADS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado.');
  }

  if (path.extname(fileName).toLowerCase() !== '.pdf') {
    return res.status(403).send('Acceso denegado a este tipo de archivo.');
  }

  res.sendFile(filePath);
};