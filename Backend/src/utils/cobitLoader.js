const { CobitProcess, Control } = require('../models');

// Datos de ejemplo para COBIT 5
const COBIT5_PROCESSES = [
  // EDM Domain
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
  // APO Domain
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
    domain: "APO",
    process_code: "APO03",
    process_name: "Gestionar la arquitectura empresarial",
    description: "Gestionar la arquitectura empresarial...",
    process_goals: [
      "Arquitectura definida y comunicada"
    ]
  },
  {
    domain: "APO",
    process_code: "APO04",
    process_name: "Gestionar la innovación",
    description: "Gestionar la innovación en TI...",
    process_goals: [
      "Innovaciones evaluadas e implementadas"
    ]
  },
  {
    domain: "APO",
    process_code: "APO05",
    process_name: "Gestionar el portafolio",
    description: "Gestionar el portafolio de programas y proyectos...",
    process_goals: [
      "Portafolio alineado con estrategia"
    ]
  },
  {
    domain: "APO",
    process_code: "APO06",
    process_name: "Gestionar el presupuesto y costos",
    description: "Gestionar el presupuesto y costos de TI...",
    process_goals: [
      "Presupuesto controlado"
    ]
  },
  {
    domain: "APO",
    process_code: "APO07",
    process_name: "Gestionar los recursos humanos",
    description: "Gestionar los recursos humanos de TI...",
    process_goals: [
      "Recursos capacitados y motivados"
    ]
  },
  {
    domain: "APO",
    process_code: "APO08",
    process_name: "Gestionar las relaciones",
    description: "Gestionar las relaciones con clientes y usuarios...",
    process_goals: [
      "Relaciones efectivas mantenidas"
    ]
  },
  {
    domain: "APO",
    process_code: "APO09",
    process_name: "Gestionar los acuerdos de nivel de servicio",
    description: "Gestionar los SLA con clientes...",
    process_goals: [
      "SLA definidos y cumplidos"
    ]
  },
  {
    domain: "APO",
    process_code: "APO10",
    process_name: "Gestionar proveedores",
    description: "Gestionar relaciones con proveedores...",
    process_goals: [
      "Proveedores evaluados y monitoreados"
    ]
  },
  // BAI Domain
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
    domain: "BAI",
    process_code: "BAI02",
    process_name: "Gestionar la definición de requerimientos",
    description: "Gestionar la definición de requerimientos...",
    process_goals: [
      "Requerimientos bien definidos"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI03",
    process_name: "Gestionar la identificación y construcción de soluciones",
    description: "Gestionar la construcción de soluciones...",
    process_goals: [
      "Soluciones de calidad entregadas"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI04",
    process_name: "Gestionar la disponibilidad e infraestructura",
    description: "Gestionar la infraestructura de TI...",
    process_goals: [
      "Infraestructura disponible y escalable"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI05",
    process_name: "Gestionar la habilitación organizacional",
    description: "Gestionar la habilitación y adopción de cambios...",
    process_goals: [
      "Adopción exitosa de cambios"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI06",
    process_name: "Gestionar cambios",
    description: "Gestionar cambios en el ambiente de TI...",
    process_goals: [
      "Cambios controlados y registrados"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI07",
    process_name: "Gestionar la transición hacia el sistema de producción",
    description: "Gestionar la transición a producción...",
    process_goals: [
      "Transiciones exitosas sin problemas"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI08",
    process_name: "Gestionar el conocimiento",
    description: "Gestionar el conocimiento de TI...",
    process_goals: [
      "Conocimiento documentado y accesible"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI09",
    process_name: "Gestionar los activos",
    description: "Gestionar los activos de TI...",
    process_goals: [
      "Activos inventariados y monitoreados"
    ]
  },
  {
    domain: "BAI",
    process_code: "BAI10",
    process_name: "Gestionar las configuraciones",
    description: "Gestionar las configuraciones...",
    process_goals: [
      "Configuraciones documentadas"
    ]
  },
  // DSS Domain
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
    domain: "DSS",
    process_code: "DSS02",
    process_name: "Gestionar el procesamiento de trabajos",
    description: "Gestionar el procesamiento de trabajos...",
    process_goals: [
      "Trabajos ejecutados correctamente"
    ]
  },
  {
    domain: "DSS",
    process_code: "DSS03",
    process_name: "Gestionar y garantizar la continuidad del servicio",
    description: "Gestionar la continuidad y recuperación...",
    process_goals: [
      "Servicios recuperados ante desastres"
    ]
  },
  {
    domain: "DSS",
    process_code: "DSS04",
    process_name: "Garantizar la seguridad de los servicios de TI",
    description: "Gestionar la seguridad de TI...",
    process_goals: [
      "Sistemas seguros contra amenazas"
    ]
  },
  {
    domain: "DSS",
    process_code: "DSS05",
    process_name: "Gestionar el catálogo de servicios",
    description: "Gestionar el catálogo de servicios...",
    process_goals: [
      "Servicios documentados"
    ]
  },
  {
    domain: "DSS",
    process_code: "DSS06",
    process_name: "Gestionar el incidente de TI",
    description: "Gestionar incidentes de TI...",
    process_goals: [
      "Incidentes resueltos a tiempo"
    ]
  },
  {
    domain: "DSS",
    process_code: "DSS07",
    process_name: "Gestionar las solicitudes de servicio",
    description: "Gestionar solicitudes de servicio...",
    process_goals: [
      "Solicitudes atendidas correctamente"
    ]
  },
  // MEA Domain
  {
    domain: "MEA",
    process_code: "MEA01",
    process_name: "Monitorizar, evaluar y valorar el desempeño y conformidad",
    description: "Monitorear y evaluar el desempeño y conformidad de TI...",
    process_goals: [
      "Desempeño de TI medido y reportado",
      "Cumplimiento normativo demostrado"
    ]
  },
  {
    domain: "MEA",
    process_code: "MEA02",
    process_name: "Evaluar el sistema de gobierno de TI",
    description: "Evaluar el sistema de gobierno...",
    process_goals: [
      "Gobierno evaluado periódicamente"
    ]
  },
  {
    domain: "MEA",
    process_code: "MEA03",
    process_name: "Garantizar el cumplimiento independiente",
    description: "Garantizar el cumplimiento independiente...",
    process_goals: [
      "Cumplimiento verificado independientemente"
    ]
  }
];

const COBIT5_CONTROLS = [
  // EDM Controls
  {
    control_code: "EDM01.01",
    control_statement: "Definir un conjunto coherente de políticas de TI alineadas con los objetivos del negocio",
    metrics: "Número de políticas documentadas y aprobadas, porcentaje de cumplimiento",
    weight: 1.5
  },
  {
    control_code: "EDM01.02",
    control_statement: "Comunicar las políticas de TI a todas las partes interesadas",
    metrics: "Porcentaje de empleados capacitados en políticas de TI",
    weight: 1.0
  },
  {
    control_code: "EDM02.01",
    control_statement: "Alinear la entrega de beneficios de TI con los objetivos de negocio",
    metrics: "Beneficios realizados vs beneficios proyectados",
    weight: 2.0
  },
  // APO Controls
  {
    control_code: "APO01.01",
    control_statement: "Establecer el marco de gobierno de TI",
    metrics: "Marco de gobierno documentado, roles definidos",
    weight: 1.8
  },
  {
    control_code: "APO01.02",
    control_statement: "Informar sobre la gobernanza de TI",
    metrics: "Reportes de gobernanza generados, comités establecidos",
    weight: 1.2
  },
  {
    control_code: "APO01.03",
    control_statement: "Garantizar la gestión de riesgos de TI",
    metrics: "Riesgos identificados y mitigados, planes de continuidad",
    weight: 2.0
  },
  {
    control_code: "APO02.01",
    control_statement: "Desarrollar y mantener la estrategia de TI",
    metrics: "Nivel de alineación medido anualmente, número de iniciativas alineadas",
    weight: 2.0
  },
  {
    control_code: "APO02.02",
    control_statement: "Definir el portafolio de servicios de TI",
    metrics: "Servicios documentados, catálogo actualizado",
    weight: 1.5
  },
  {
    control_code: "APO03.01",
    control_statement: "Establecer programas de desarrollo de capacidades",
    metrics: "Personas capacitadas, evaluaciones de competencia",
    weight: 1.2
  },
  {
    control_code: "APO04.01",
    control_statement: "Gestionar la innovación en TI",
    metrics: "Ideas evaluadas, innovaciones implementadas",
    weight: 1.0
  },
  {
    control_code: "APO05.01",
    control_statement: "Gestionar el portafolio de programas y proyectos",
    metrics: "ROI de proyectos, valor realizado",
    weight: 1.8
  },
  {
    control_code: "APO06.01",
    control_statement: "Gestionar el servicio de presupuestos",
    metrics: "Presupuesto ejecutado vs planeado",
    weight: 1.5
  },
  {
    control_code: "APO07.01",
    control_statement: "Gestionar los recursos de TI",
    metrics: "Utilización de recursos, productividad",
    weight: 1.3
  },
  {
    control_code: "APO08.01",
    control_statement: "Gestionar las relaciones",
    metrics: "Satisfacción de clientes, acuerdos de servicio",
    weight: 1.2
  },
  {
    control_code: "APO09.01",
    control_statement: "Gestionar los acuerdos de nivel de servicio",
    metrics: "Cumplimiento de SLA, disponibilidad",
    weight: 1.4
  },
  {
    control_code: "APO10.01",
    control_statement: "Gestionar los proveedores",
    metrics: "Evaluación de proveedores, gestión de contratos",
    weight: 1.3
  },
  // BAI Controls
  {
    control_code: "BAI01.01",
    control_statement: "Establecer un marco de gestión de programas y proyectos",
    metrics: "Porcentaje de proyectos que cumplen con tiempo y presupuesto",
    weight: 1.2
  },
  {
    control_code: "BAI01.02",
    control_statement: "Gestionar el ciclo de vida de programas",
    metrics: "Programas completados en tiempo y presupuesto",
    weight: 1.3
  },
  {
    control_code: "BAI02.01",
    control_statement: "Gestionar la definición de requerimientos",
    metrics: "Requerimientos documentados, trazabilidad",
    weight: 1.2
  },
  {
    control_code: "BAI03.01",
    control_statement: "Gestionar la identificación y construcción de soluciones",
    metrics: "Soluciones entregadas, calidad de código",
    weight: 1.4
  },
  {
    control_code: "BAI04.01",
    control_statement: "Gestionar la disponibilidad e infraestructura",
    metrics: "Disponibilidad medida, capacidad planeada",
    weight: 1.5
  },
  {
    control_code: "BAI05.01",
    control_statement: "Gestionar la habilitación organizacional",
    metrics: "Adopción de sistemas, resistencia al cambio",
    weight: 1.2
  },
  {
    control_code: "BAI06.01",
    control_statement: "Gestionar cambios",
    metrics: "Cambios implementados, reversiones",
    weight: 1.6
  },
  {
    control_code: "BAI07.01",
    control_statement: "Gestionar la transición hacia el sistema de producción",
    metrics: "Transiciones exitosas, defectos residuales",
    weight: 1.3
  },
  {
    control_code: "BAI08.01",
    control_statement: "Gestionar el conocimiento",
    metrics: "Base de conocimiento mantenida, documentación",
    weight: 1.0
  },
  {
    control_code: "BAI09.01",
    control_statement: "Gestionar los activos",
    metrics: "Inventario de activos, depreciación",
    weight: 1.2
  },
  {
    control_code: "BAI10.01",
    control_statement: "Gestionar las configuraciones",
    metrics: "Elementos configurados, precisión de CMDB",
    weight: 1.3
  },
  // DSS Controls
  {
    control_code: "DSS01.01",
    control_statement: "Establecer un centro de operaciones de TI",
    metrics: "Disponibilidad del SOC, métricas de operación",
    weight: 1.4
  },
  {
    control_code: "DSS01.02",
    control_statement: "Gestionar la infraestructura de TI",
    metrics: "Disponibilidad de infraestructura, capacidad",
    weight: 1.5
  },
  {
    control_code: "DSS02.01",
    control_statement: "Gestionar el procesamiento de trabajos",
    metrics: "Trabajos completados a tiempo, errores",
    weight: 1.1
  },
  {
    control_code: "DSS03.01",
    control_statement: "Gestionar y garantizar la continuidad del servicio",
    metrics: "Planes de continuidad, pruebas realizadas",
    weight: 1.8
  },
  {
    control_code: "DSS04.01",
    control_statement: "Garantizar la seguridad de los servicios de TI",
    metrics: "Incidentes de seguridad, cumplimiento de controles",
    weight: 2.0
  },
  {
    control_code: "DSS05.01",
    control_statement: "Gestionar el catálogo de servicios",
    metrics: "Servicios documentados, utilización",
    weight: 1.2
  },
  {
    control_code: "DSS06.01",
    control_statement: "Gestionar el incidente de TI",
    metrics: "Incidentes resueltos a tiempo, satisfacción",
    weight: 1.4
  },
  {
    control_code: "DSS07.01",
    control_statement: "Gestionar las solicitudes de servicio",
    metrics: "Solicitudes atendidas a tiempo, satisfacción",
    weight: 1.2
  },
  // MEA Controls
  {
    control_code: "MEA01.01",
    control_statement: "Establecer un marco de medición del desempeño",
    metrics: "Número de KPIs definidos, frecuencia de reportes",
    weight: 1.0
  },
  {
    control_code: "MEA01.02",
    control_statement: "Evaluar el cumplimiento de requerimientos externos",
    metrics: "Auditorías completadas, cumplimiento",
    weight: 1.4
  },
  {
    control_code: "MEA02.01",
    control_statement: "Evaluar el sistema de gobierno de TI",
    metrics: "Evaluaciones realizadas, mejoras implementadas",
    weight: 1.3
  },
  {
    control_code: "MEA03.01",
    control_statement: "Garantizar el cumplimiento independiente",
    metrics: "Evaluaciones independientes, resultados",
    weight: 1.2
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