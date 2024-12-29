const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes'); 
const registerAdminRoutes = require('./routes/registerAdminRoutes'); 
const registerBeneficiaryRoutes = require('./routes/registerBeneficiaryRoutes'); 
const estadoRoutes = require('./routes/estadoRoutes'); 
const estratoRoutes = require('./routes/estratoRoutes'); 
const historialCambioRoutes = require('./routes/historialCambioRoutes'); 
const roleRoutes = require('./routes/roleRoutes'); 
const sexoRoutes = require('./routes/sexoRoutes'); 
const tipoDocumentoRoutes = require('./routes/tipoDocumentoRoutes'); 
const viaRoutes = require('./routes/viaRoutes'); 
const tipoUnidadRoutes = require('./routes/tipoUnidadRoutes'); 
const barrioRoutes = require('./routes/barrioRoutes'); 
const facturacionRoutes = require('./routes/facturacionRoutes'); 
const morgan = require('morgan');
const path = require('path');

// Importa la conexión de Sequelize
const sequelize = require('./config/db');
const { Beneficiario } = require('./models/Beneficiario');
const Documento = require('./models/Documento');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend
  credentials: true, // Permitir envío de cookies o headers de autenticación
};

app.use(morgan('dev'));
// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/auth', authRoutes);
app.use('/api/v1/document', documentRoutes); // Ruta para manejar la carga de documentos
app.use('/api/v1/facturation', facturacionRoutes); 

app.use('/api/v1/admin', registerAdminRoutes);
app.use('/api/v1/beneficiary', registerBeneficiaryRoutes);
app.use('/api/v1/state', estadoRoutes);
app.use('/api/v1/stratum', estratoRoutes);
app.use('/api/v1/change', historialCambioRoutes);
app.use('/api/v1/role', roleRoutes);
app.use('/api/v1/sex', sexoRoutes);
app.use('/api/v1/document-type', tipoDocumentoRoutes);
app.use('/api/v1/via', viaRoutes);
app.use('/api/v1/unit-type', tipoUnidadRoutes);
app.use('/api/v1/neighborhood', barrioRoutes);

Beneficiario.hasMany(Documento, {
  foreignKey: 'Beneficiario_idBeneficiario',
  targetKey: 'idBeneficiario',
  as: 'documentos',
});

Documento.belongsTo(Beneficiario, {
  foreignKey: 'Beneficiario_idBeneficiario',  // Clave foránea en Documento
  // targetKey: 'idBeneficiario',  // Clave primaria en Beneficiario
  // as: 'beneficiario',  // Alias para la relación
});

// Sincroniza la base de datos con Sequelize antes de iniciar el servidor
sequelize.sync({ force: false }) // Usa { force: false } para evitar que elimine las tablas al reiniciar (solo usa { force: true } en desarrollo)
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });