import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import resultadoEstudioModelo from '../models/ResultadoEstudio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'files'));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const pacienteId = req.body.pacienteId || 'unknown'; 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${pacienteId}-${uniqueSuffix}${extension}`);
  }
});

// Middleware de subida (solo PDFs)
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF.'), false);
    }
  }
}).single('archivoPDF');

// POST /api/resultados/upload
export const uploadResultado = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Error de subida de archivo', error: err.message });
    } else if (err) {
      return res.status(400).json({ message: 'Error al procesar el archivo', error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }
    
    const { pacienteId, empleadoId, tipoEstudio, observaciones } = req.body;
    
    if (!pacienteId || !tipoEstudio) {
      fs.unlink(req.file.path, () => {
        return res.status(440).json({ message: 'Faltan datos requeridos para el registro.' });
      });
      return;
    }

    try {
      const newResultado = {
        paciente: pacienteId,
        empleado: empleadoId || null, // Puede ser opcional
        tipoEstudio: tipoEstudio,
        observaciones: observaciones,
        nombreArchivo: req.file.filename
      };

      const resultadoCreado = await resultadoEstudioModelo.create(newResultado);
      res.status(201).json({ message: 'Resultado de estudio cargado exitosamente', data: resultadoCreado });

    } catch (error) {
      fs.unlink(req.file.path, () => {
        console.error("Error DB, archivo eliminado: ", req.file.filename);
      });
      res.status(500).json({ message: 'Error al registrar el resultado en la base de datos.', error: error.message });
    }
  });
};


// GET /api/resultados/:pacienteId
export const getHistorialByPaciente = async (req, res) => {
  try {
    const historial = await resultadoEstudioModelo.getByPacienteId(req.params.pacienteId);
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de estudios.', error: error.message });
  }
};

// DELETE /api/resultados/:id (Elimina el registro de DB y el archivo físico)
export const deleteResultado = async (req, res) => {
  try {
    const resultado = await resultadoEstudioModelo.ResultadoEstudio.findById(req.params.id);
    if (!resultado) {
      return res.status(404).json({ message: 'Registro de estudio no encontrado.' });
    }

    const filePath = path.join(__dirname, '..', '..', 'files', resultado.nombreArchivo);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error al eliminar el archivo físico:", err);
    });

    await resultadoEstudioModelo.deleteById(req.params.id);

    res.status(200).json({ message: 'Resultado de estudio eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el registro.', error: error.message });
  }
};