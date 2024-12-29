const { Op } = require('sequelize');
const { Beneficiario } = require('../models/Beneficiario');
const { HistorialCambio } = require('../models/HistorialCambio');
const Estado = require('../models/Estado');
const Estrato = require('../models/Estrato');
const TipoDocumento = require('../models/TipoDocumento');
const Administrador = require('../models/Administrador');
const Sexo = require('../models/Sexo'); // Modelo de Sexo
const Documento = require('../models/Documento'); // Modelo de Sexo

const registerBeneficiaryController = {
  // Registrar un beneficiario
  async registerBeneficiary(req, res) {
    const {
      Nombre,
      Apellido,
      TipoDocumento_idTipoDocumento,
      NumeroDocumento,
      Telefono,
      Celular,
      Correo,
      FechaNacimiento,  // Nuevo campo para fecha de nacimiento
      FechaInicio,      // Campo actualizado a tipo DATE
      FechaFin,         // Campo actualizado a tipo DATE
      CodigoDaneDpmto,
      CodigoDaneMunicipio,
      Departamento,
      Municipio,
      Direccion,
      Barrio,
      Anexo,
      Estado_idEstado,
      Estrato_idEstrato,
      Sexo_idSexo,  // Nuevo campo para sexo
    } = req.body;

    const idAdministrador = req.user.id; // ID del administrador activo (extraído del middleware de autenticación)

    // Validar campos obligatorios
    if (
      !Nombre || !Apellido || !TipoDocumento_idTipoDocumento || !NumeroDocumento ||
      !Correo || !FechaInicio || !CodigoDaneDpmto || !CodigoDaneMunicipio ||
      !Direccion || !Estado_idEstado || !Estrato_idEstrato
    ) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados' });
    }

    try {
      // Verificar si el NumeroDocumento ya está registrado
      const existingBeneficiary = await Beneficiario.findOne({
        where: { NumeroDocumento },  // Buscamos un beneficiario con el mismo número de documento
      });

      if (existingBeneficiary) {
        return res.status(400).json({
          message: 'El Número de Documento ya está registrado con otro beneficiario.',
        });
      }

      // Insertar el beneficiario en la base de datos
      const newBeneficiary = await Beneficiario.create({
        Nombre,
        Apellido,
        TipoDocumento_idTipoDocumento,
        NumeroDocumento,
        Telefono: Telefono || null,  // Campo opcional
        Celular: Celular || null,    // Campo opcional
        Correo,
        FechaNacimiento,  // Asignar fecha de nacimiento aquí
        FechaInicio,
        FechaFin: FechaFin || null,  // Campo opcional
        CodigoDaneDpmto,
        CodigoDaneMunicipio,
        Departamento: Departamento || null, // Campo opcional
        Municipio: Municipio || null,     // Campo opcional
        Direccion,
        Barrio: Barrio || null,        // Campo opcional
        Anexo: Anexo || null,         // Campo opcional
        Estado_idEstado,
        Estrato_idEstrato,
        Sexo_idSexo, // Asignar el sexo aquí
        Administrador_idAdministrador: idAdministrador,
      });

      // Registrar el cambio en HistorialCambio
      await HistorialCambio.create({
        Accion: 'Creación',
        ValorAnterior: 'N/A',
        ValorNuevo: JSON.stringify(newBeneficiary),
        Administrador_idAdministrador: idAdministrador,
        Beneficiario_idBeneficiario: newBeneficiary.idBeneficiario,
      });

      res.status(201).json({
        message: 'Beneficiario registrado exitosamente',
        newBeneficiaryId: newBeneficiary.idBeneficiario,  // ID del beneficiario recién registrado
      });
    } catch (err) {
      console.error('Error al registrar el beneficiario:', err);
      res.status(500).json({
        message: 'Error al registrar el beneficiario',
        error: err.message,
      });
    }
  },

  // Obtener todos los beneficiarios
  async getAllBeneficiaries(req, res) {
    try {
      const beneficiaries = await Beneficiario.findAll({
        include: [
          {
            model: Estado,
            attributes: ['idEstado', 'Estado'],  // Incluimos el id
            as: 'estado',
          },
          {
            model: Estrato,
            attributes: ['idEstrato', 'Estrato'],  // Incluimos el id
            as: 'estrato',
          },
          {
            model: TipoDocumento,
            attributes: ['idTipoDocumento', 'TipoDocumento'],  // Incluimos el id
            as: 'tipoDocumento',
          },
          {
            model: Administrador,
            attributes: ['idAdministrador', 'Nombre', 'Apellido'],
            as: 'administrador',
          },
          {
            model: Sexo,
            attributes: ['idSexo', 'Sexo'],  // Incluimos el id
            as: 'sexo',
          },
          {
            model: Documento,  // Aquí incluimos los documentos relacionados
            attributes: ['idDocumentos', 'NombreDocumento', 'TipoDocumento', 'Url'],  // Traemos los atributos de los documentos
            as: 'documentos',  // Alias de la relación
          },
        ],
      });
  
      if (beneficiaries.length === 0) {
        return res.status(404).json({ message: 'No se encontraron beneficiarios' });
      }
  
      const formattedBeneficiaries = beneficiaries.map(beneficiary => ({
        idBeneficiario: beneficiary.idBeneficiario,
        Nombre: beneficiary.Nombre,
        Apellido: beneficiary.Apellido,
        TipoDocumento: beneficiary.tipoDocumento ? {
          id: beneficiary.tipoDocumento.idTipoDocumento,
          nombre: beneficiary.tipoDocumento.TipoDocumento
        } : null,
        NumeroDocumento: beneficiary.NumeroDocumento,
        Telefono: beneficiary.Telefono,
        Celular: beneficiary.Celular,
        Correo: beneficiary.Correo,
        Estrato: beneficiary.estrato ? {
          id: beneficiary.estrato.idEstrato,
          nombre: beneficiary.estrato.Estrato
        } : null,
        FechaNacimiento: beneficiary.FechaNacimiento,
        FechaInicio: beneficiary.FechaInicio,
        FechaFin: beneficiary.FechaFin,
        CodigoDaneDpmto: beneficiary.CodigoDaneDpmto,
        CodigoDaneMunicipio: beneficiary.CodigoDaneMunicipio,
        Departamento: beneficiary.Departamento,
        Municipio: beneficiary.Municipio,
        Direccion: beneficiary.Direccion,
        Barrio: beneficiary.Barrio,
        Anexo: beneficiary.Anexo,
        Estado: beneficiary.estado ? {
          id: beneficiary.estado.idEstado,
          nombre: beneficiary.estado.Estado
        } : null,
        Sexo: beneficiary.sexo ? {
          id: beneficiary.sexo.idSexo,
          nombre: beneficiary.sexo.Sexo
        } : null,
        Administrador: {
          idAdministrador: beneficiary.administrador ? beneficiary.administrador.idAdministrador : null,
          Nombre: beneficiary.administrador ? beneficiary.administrador.Nombre : null,
          Apellido: beneficiary.administrador ? beneficiary.administrador.Apellido : null,
        },
        CreatedAt: beneficiary.createdAt,
        UpdatedAt: beneficiary.updatedAt,
        // Aquí agregamos los documentos relacionados
        Documentos: beneficiary.documentos.map(doc => ({
          idDocumentos: doc.idDocumentos,
          NombreDocumento: doc.NombreDocumento,
          TipoDocumento: doc.TipoDocumento,
          Url: doc.Url,
        })),
      }));
  
      res.status(200).json({
        message: 'Lista de beneficiarios obtenida exitosamente',
        data: formattedBeneficiaries,
      });
    } catch (err) {
      console.error('Error al obtener la lista de beneficiarios:', err);
      res.status(500).json({
        message: 'Error al obtener la lista de beneficiarios',
        error: err.message,
      });
    }
  },
  
  // Obtener un beneficiario por su ID
  async getBeneficiaryById(req, res) {
    const { id } = req.params;
  
    try {
      const beneficiary = await Beneficiario.findByPk(id, {
        include: [
          {
            model: Estado,
            attributes: ['idEstado', 'Estado'],
            as: 'estado',
          },
          {
            model: Estrato,
            attributes: ['idEstrato', 'Estrato'],
            as: 'estrato',
          },
          {
            model: TipoDocumento,
            attributes: ['idTipoDocumento', 'TipoDocumento'],
            as: 'tipoDocumento',
          },
          {
            model: Administrador,
            attributes: ['idAdministrador', 'Nombre', 'Apellido'],
            as: 'administrador',
          },
          {
            model: Sexo,
            attributes: ['idSexo', 'Sexo'],
            as: 'sexo',
          },
          {
            model: Documento,  // Incluir los documentos relacionados
            attributes: ['idDocumentos', 'NombreDocumento', 'TipoDocumento', 'Url'],
            as: 'documentos',  // Alias de la relación
          },
        ],
      });
  
      if (!beneficiary) {
        return res.status(404).json({ message: 'Beneficiario no encontrado' });
      }
  
      const formattedBeneficiary = {
        idBeneficiario: beneficiary.idBeneficiario,
        Nombre: beneficiary.Nombre,
        Apellido: beneficiary.Apellido,
        TipoDocumento: beneficiary.tipoDocumento ? {
          id: beneficiary.tipoDocumento.idTipoDocumento,
          nombre: beneficiary.tipoDocumento.TipoDocumento,
        } : null,
        NumeroDocumento: beneficiary.NumeroDocumento,
        Telefono: beneficiary.Telefono,
        Celular: beneficiary.Celular,
        Correo: beneficiary.Correo,
        Estrato: beneficiary.estrato ? {
          id: beneficiary.estrato.idEstrato,
          nombre: beneficiary.estrato.Estrato,
        } : null,
        FechaNacimiento: beneficiary.FechaNacimiento,
        FechaInicio: beneficiary.FechaInicio,
        FechaFin: beneficiary.FechaFin,
        CodigoDaneDpmto: beneficiary.CodigoDaneDpmto,
        CodigoDaneMunicipio: beneficiary.CodigoDaneMunicipio,
        Departamento: beneficiary.Departamento,
        Municipio: beneficiary.Municipio,
        Direccion: beneficiary.Direccion,
        Barrio: beneficiary.Barrio,
        Anexo: beneficiary.Anexo,
        Estado: beneficiary.estado ? {
          id: beneficiary.estado.idEstado,
          nombre: beneficiary.estado.Estado,
        } : null,
        Sexo: beneficiary.sexo ? {
          id: beneficiary.sexo.idSexo,
          nombre: beneficiary.sexo.Sexo,
        } : null,
        Administrador: {
          idAdministrador: beneficiary.administrador ? beneficiary.administrador.idAdministrador : null,
          Nombre: beneficiary.administrador ? beneficiary.administrador.Nombre : null,
          Apellido: beneficiary.administrador ? beneficiary.administrador.Apellido : null,
        },
        CreatedAt: beneficiary.createdAt,
        UpdatedAt: beneficiary.updatedAt,
        // Aquí agregamos los documentos relacionados
        Documentos: beneficiary.documentos.map(doc => ({
          idDocumentos: doc.idDocumentos,
          NombreDocumento: doc.NombreDocumento,
          TipoDocumento: doc.TipoDocumento,
          Url: doc.Url,
        })),
      };
  
      res.status(200).json({
        message: 'Beneficiario encontrado',
        data: formattedBeneficiary,
      });
    } catch (err) {
      console.error('Error al obtener el beneficiario:', err);
      res.status(500).json({
        message: 'Error al obtener el beneficiario',
        error: err.message,
      });
    }
  },

// Obtener un beneficiario por su número de documento
async getBeneficiaryByNumeroDocumento(req, res) {
  const { numeroDocumento } = req.params;

  try {
    const beneficiary = await Beneficiario.findOne({
      where: { NumeroDocumento: numeroDocumento },
      include: [
        {
          model: Estado,
          attributes: ['idEstado', 'Estado'],
          as: 'estado',
        },
        {
          model: Estrato,
          attributes: ['idEstrato', 'Estrato'],
          as: 'estrato',
        },
        {
          model: TipoDocumento,
          attributes: ['idTipoDocumento', 'TipoDocumento'],
          as: 'tipoDocumento',
        },
        {
          model: Administrador,
          attributes: ['idAdministrador', 'Nombre', 'Apellido'],
          as: 'administrador',
        },
        {
          model: Sexo,
          attributes: ['idSexo', 'Sexo'],
          as: 'sexo',
        },
        {
          model: Documento,  // Incluir los documentos relacionados
          attributes: ['idDocumentos', 'NombreDocumento', 'TipoDocumento', 'Url'],
          as: 'documentos',  // Alias de la relación
        },
      ],
    });

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiario no encontrado' });
    }

    const formattedBeneficiary = {
      idBeneficiario: beneficiary.idBeneficiario,
      Nombre: beneficiary.Nombre,
      Apellido: beneficiary.Apellido,
      TipoDocumento: beneficiary.tipoDocumento ? {
        id: beneficiary.tipoDocumento.idTipoDocumento,
        nombre: beneficiary.tipoDocumento.TipoDocumento,
      } : null,
      NumeroDocumento: beneficiary.NumeroDocumento,
      Telefono: beneficiary.Telefono,
      Celular: beneficiary.Celular,
      Correo: beneficiary.Correo,
      Estrato: beneficiary.estrato ? {
        id: beneficiary.estrato.idEstrato,
        nombre: beneficiary.estrato.Estrato,
      } : null,
      FechaNacimiento: beneficiary.FechaNacimiento,
      FechaInicio: beneficiary.FechaInicio,
      FechaFin: beneficiary.FechaFin,
      CodigoDaneDpmto: beneficiary.CodigoDaneDpmto,
      CodigoDaneMunicipio: beneficiary.CodigoDaneMunicipio,
      Departamento: beneficiary.Departamento,
      Municipio: beneficiary.Municipio,
      Direccion: beneficiary.Direccion,
      Barrio: beneficiary.Barrio,
      Anexo: beneficiary.Anexo,
      Estado: beneficiary.estado ? {
        id: beneficiary.estado.idEstado,
        nombre: beneficiary.estado.Estado,
      } : null,
      Sexo: beneficiary.sexo ? {
        id: beneficiary.sexo.idSexo,
        nombre: beneficiary.sexo.Sexo,
      } : null,
      Administrador: {
        idAdministrador: beneficiary.administrador ? beneficiary.administrador.idAdministrador : null,
        Nombre: beneficiary.administrador ? beneficiary.administrador.Nombre : null,
        Apellido: beneficiary.administrador ? beneficiary.administrador.Apellido : null,
      },
      CreatedAt: beneficiary.createdAt,
      UpdatedAt: beneficiary.updatedAt,
      // Aquí agregamos los documentos relacionados
      Documentos: beneficiary.documentos.map(doc => ({
        idDocumentos: doc.idDocumentos,
        NombreDocumento: doc.NombreDocumento,
        TipoDocumento: doc.TipoDocumento,
        Url: doc.Url,
      })),
    };

    res.status(200).json({
      message: 'Beneficiario encontrado exitosamente',
      data: formattedBeneficiary,
    });
  } catch (err) {
    console.error('Error al obtener el beneficiario por número de documento:', err);
    res.status(500).json({
      message: 'Error al obtener el beneficiario por número de documento',
      error: err.message,
    });
  }
},

  // Actualizar un beneficiario
  async updateBeneficiary(req, res) {
    const { id } = req.params;
    const {
      Nombre,
      Apellido,
      TipoDocumento_idTipoDocumento,
      NumeroDocumento,
      Telefono,
      Celular,
      Correo,
      FechaNacimiento,  // Agregar FechaNacimiento aquí
      FechaInicio,
      FechaFin,
      CodigoDaneDpmto,
      CodigoDaneMunicipio,
      Departamento,
      Municipio,
      Direccion,
      Barrio,
      Anexo,
      Estado_idEstado,
      Estrato_idEstrato,
      Sexo_idSexo, // Nuevo campo para sexo
    } = req.body;
  
    const idAdministrador = req.user.id; // ID del administrador activo (extraído del middleware de autenticación)
  
    try {
      // Buscar el beneficiario
      const beneficiary = await Beneficiario.findByPk(id);
  
      if (!beneficiary) {
        return res.status(404).json({ message: 'Beneficiario no encontrado' });
      }
  
      // Verificar si el número de documento ya está registrado
      const existingBeneficiary = await Beneficiario.findOne({
        where: { NumeroDocumento: NumeroDocumento, idBeneficiario: { [Op.ne]: id } }, // Excluye el beneficiario actual
      });
  
      if (existingBeneficiary) {
        return res.status(400).json({ message: 'El número de documento ya está registrado' });
      }
  
      // Registrar los valores anteriores para el historial
      const previousValues = {
        Nombre: beneficiary.Nombre,
        Apellido: beneficiary.Apellido,
        TipoDocumento_idTipoDocumento: beneficiary.TipoDocumento_idTipoDocumento,
        NumeroDocumento: beneficiary.NumeroDocumento,
        Telefono: beneficiary.Telefono,
        Celular: beneficiary.Celular,
        Correo: beneficiary.Correo,
        FechaNacimiento: beneficiary.FechaNacimiento,  // Incluir FechaNacimiento en el historial
        FechaInicio: beneficiary.FechaInicio,
        FechaFin: beneficiary.FechaFin,
        CodigoDaneDpmto: beneficiary.CodigoDaneDpmto,
        CodigoDaneMunicipio: beneficiary.CodigoDaneMunicipio,
        Departamento: beneficiary.Departamento,
        Municipio: beneficiary.Municipio,
        Direccion: beneficiary.Direccion,
        Barrio: beneficiary.Barrio,
        Anexo: beneficiary.Anexo,
        Estado_idEstado: beneficiary.Estado_idEstado,
        Estrato_idEstrato: beneficiary.Estrato_idEstrato,
        Sexo_idSexo: beneficiary.Sexo_idSexo,
      };
  
      // Actualizar el beneficiario
      beneficiary.Nombre = Nombre || beneficiary.Nombre;
      beneficiary.Apellido = Apellido || beneficiary.Apellido;
      beneficiary.TipoDocumento_idTipoDocumento = TipoDocumento_idTipoDocumento || beneficiary.TipoDocumento_idTipoDocumento;
      beneficiary.NumeroDocumento = NumeroDocumento || beneficiary.NumeroDocumento;
      beneficiary.Telefono = Telefono || beneficiary.Telefono;
      beneficiary.Celular = Celular || beneficiary.Celular;
      beneficiary.Correo = Correo || beneficiary.Correo;
      beneficiary.FechaNacimiento = FechaNacimiento || beneficiary.FechaNacimiento;  // Actualizar FechaNacimiento aquí
      beneficiary.FechaInicio = FechaInicio || beneficiary.FechaInicio;
      beneficiary.FechaFin = FechaFin || beneficiary.FechaFin;
      beneficiary.CodigoDaneDpmto = CodigoDaneDpmto || beneficiary.CodigoDaneDpmto;
      beneficiary.CodigoDaneMunicipio = CodigoDaneMunicipio || beneficiary.CodigoDaneMunicipio;
      beneficiary.Departamento = Departamento || beneficiary.Departamento;
      beneficiary.Municipio = Municipio || beneficiary.Municipio;
      beneficiary.Direccion = Direccion || beneficiary.Direccion;
      beneficiary.Barrio = Barrio || beneficiary.Barrio;
      beneficiary.Anexo = Anexo || beneficiary.Anexo;
      beneficiary.Estado_idEstado = Estado_idEstado || beneficiary.Estado_idEstado;
      beneficiary.Estrato_idEstrato = Estrato_idEstrato || beneficiary.Estrato_idEstrato;
      beneficiary.Sexo_idSexo = Sexo_idSexo || beneficiary.Sexo_idSexo;  // Actualizar el sexo aquí
  
      // Guardar cambios
      await beneficiary.save();
  
      // Registrar el cambio en HistorialCambio
      await HistorialCambio.create({
        Accion: 'Actualización',
        ValorAnterior: JSON.stringify(previousValues),
        ValorNuevo: JSON.stringify(beneficiary),
        Administrador_idAdministrador: idAdministrador,
        Beneficiario_idBeneficiario: beneficiary.idBeneficiario,
      });
  
      res.status(200).json({
        message: 'Beneficiario actualizado exitosamente',
        updatedBeneficiaryId: beneficiary.idBeneficiario,
      });
    } catch (err) {
      console.error('Error al actualizar el beneficiario:', err);
      res.status(500).json({
        message: 'Error al actualizar el beneficiario',
        error: err.message,
      });
    }
  },

  // Eliminar un beneficiario
  async deleteBeneficiary(req, res) {
  const { id } = req.params;
  const idAdministrador = req.user.id; // ID del administrador activo (extraído del middleware de autenticación)

  try {
    const beneficiary = await Beneficiario.findByPk(id);

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiario no encontrado' });
    }

    // Registrar el cambio en HistorialCambio antes de eliminar
    await HistorialCambio.create({
      Accion: 'Eliminación',
      ValorAnterior: JSON.stringify(beneficiary), // Guardamos los datos del beneficiario antes de eliminarlo
      ValorNuevo: 'N/A', // En la eliminación, no hay nuevo valor
      Administrador_idAdministrador: idAdministrador,
      Beneficiario_idBeneficiario: beneficiary.idBeneficiario,
    });

    // Eliminar el beneficiario
    await beneficiary.destroy();

    res.status(200).json({
      message: 'Beneficiario eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error al eliminar el beneficiario:', err);
    res.status(500).json({
      message: 'Error al eliminar el beneficiario',
      error: err.message,
    });
  }
},
};

module.exports = registerBeneficiaryController;