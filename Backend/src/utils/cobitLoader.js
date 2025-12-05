const { CobitProcess, Control } = require('../models');

// Datos de ejemplo para COBIT 5
const COBIT5_PROCESSES = [
  {
    domain: "EDM",
    process_code: "EDM01",
    process_name: "Garantizar la definición y mantenimiento del marco de gobierno",
    description: "Establecer y mantener el marco de gobierno de TI...",
    process_goals: [
      "Marco de gobierno definido y comunicado",
      "Roles y responsabilidades definidos"
    ]
  },
  {
    domain: "EDM",
    process_code: "EDM02",
    process_name: "Garantizar la entrega de beneficios",
    description: "Asegurar que TI entregue los beneficios prometidos...",
    process_goals: [
      "Beneficios de TI identificados y monitoreados",
      "Inversiones en TI alineadas con objetivos de negocio"
    ]
  },
  {
    domain: "APO",
    process_code: "APO01",
    process_name: "Gestionar el marco de gestión de TI",
    description: "Proporcionar un marco coherente de principios, políticas...",
    process_goals: [
      "Políticas de TI alineadas con objetivos de negocio",
      "Cumplimiento normativo asegurado"
    ]
  },
  {
    domain: "APO",
    process_code: "APO02",
    process_name: "Gestionar la estrategia",
    description: "Traducir la estrategia de negocio en una estrategia de TI...",
    process_goals: [
      "Estrategia de TI alineada con negocio",
      "Portafolio de servicios definido"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI01",
    process_name: "Gestionar programas y proyectos",
    description: "Gestionar todos los programas y proyectos de TI...",
    process_goals: [
      "Proyectos entregados en tiempo y presupuesto",
      "Calidad de entregables asegurada"
    ]
  },
  {
    domain: "DSS",
    process_code: "DSS01",
    process_name: "Gestionar operaciones",
    description: "Gestionar las operaciones de TI de forma efectiva...",
    process_goals: [
      "Servicios de TI disponibles según acuerdos",
      "Incidentes resueltos oportunamente"
    ]
  },
  {
    domain: "MEA",
    process_code: "MEA01",
    process_name: "Monitorizar, evaluar y valorar el desempeño y conformidad",
    description: "Monitorear y evaluar el desempeño y conformidad de TI...",
    process_goals: [
      "Desempeño de TI medido y reportado",
      "Cumplimiento normativo demostrado"
    ]
  }
];

const COBIT5_CONTROLS = [
  {
    control_code: "APO01.01",
    control_statement: "Definir un conjunto coherente de políticas de TI alineadas con los objetivos del negocio",
    metrics: "Número de políticas documentadas y aprobadas, porcentaje de cumplimiento",
    weight: 1.5
  },
  {
    control_code: "APO01.02",
    control_statement: "Comunicar las políticas de TI a todas las partes interesadas",
    metrics: "Porcentaje de empleados capacitados en políticas de TI",
    weight: 1.0
  },
  {
    control_code: "APO02.01",
    control_statement: "Desarrollar y mantener la estrategia de TI alineada con la estrategia de negocio",
    metrics: "Nivel de alineación medido anualmente, número de iniciativas alineadas",
    weight: 2.0
  },
  {
    control_code: "BAI01.01",
    control_statement: "Establecer y mantener un marco de gestión de proyectos",
    metrics: "Porcentaje de proyectos que cumplen con tiempo y presupuesto",
    weight: 1.2
  },
  {
    control_code: "DSS01.01",
    control_statement: "Monitorear la disponibilidad y desempeño de los servicios de TI",
    metrics: "Porcentaje de disponibilidad medido vs SLA",
    weight: 1.3
  },
  {
    control_code: "MEA01.01",
    control_statement: "Establecer y mantener un marco de medición del desempeño",
    metrics: "Número de KPIs definidos, frecuencia de reportes",
    weight: 1.0
  }
];

const loadCobitData = async () => {
  try {
    console.log('Cargando datos COBIT 5...');
    
    // Cargar procesos
    for (const processData of COBIT5_PROCESSES) {
      await CobitProcess.findOrCreate({
        where: { process_code: processData.process_code },
        defaults: processData
      });
    }
    
    console.log(`✅ ${COBIT5_PROCESSES.length} procesos COBIT 5 cargados`);
    
    // Cargar controles (asociar a procesos existentes)
    for (const controlData of COBIT5_CONTROLS) {
      // Extraer código de proceso del código de control (ej: APO01.01 -> APO01)
      const processCode = controlData.control_code.split('.')[0];
      
      const process = await CobitProcess.findOne({
        where: { process_code: processCode }
      });
      
      if (process) {
        await Control.findOrCreate({
          where: { control_code: controlData.control_code },
          defaults: {
            ...controlData,
            process_id: process.id
          }
        });
      }
    }
    
    console.log(`✅ ${COBIT5_CONTROLS.length} controles COBIT 5 cargados`);
    console.log('✅ Datos COBIT 5 cargados exitosamente');
    
  } catch (error) {
    console.error('Error cargando datos COBIT:', error);
    throw error;
  }
};

module.exports = loadCobitData;