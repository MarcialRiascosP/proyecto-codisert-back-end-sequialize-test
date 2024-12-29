const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';

    // Verificar si la carpeta 'uploads' existe, si no, crearla
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath); // Carpeta donde se almacenarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// Filtro de archivos (solo imágenes o PDFs permitidos)
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG) y PDFs.'), false);
  }
};

// Inicializar multer con la configuración de almacenamiento y filtro de archivos
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limitar el tamaño del archivo a 10MB
});

module.exports = upload;