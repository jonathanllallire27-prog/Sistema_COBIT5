// Datos de ejemplo para COBIT 5 (usados cuando la API no está disponible)
export const COBIT5_PROCESSES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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

export const COBIT5_CONTROLS = [
  {
    id: 1,
    process_id: 3,
    control_code: "APO01.01",
    control_statement: "Definir un conjunto coherente de políticas de TI alineadas con los objetivos del negocio",
    metrics: "Número de políticas documentadas y aprobadas, porcentaje de cumplimiento",
    weight: 1.5,
    maturity_levels: {
      0: "No existen políticas documentadas",
      1: "Políticas ad-hoc no formalizadas",
      2: "Políticas definidas pero no consistentes",
      3: "Políticas definidas y comunicadas",
      4: "Políticas monitoreadas y mejoradas",
      5: "Políticas optimizadas y alineadas"
    }
  },
  {
    id: 2,
    process_id: 3,
    control_code: "APO01.02",
    control_statement: "Comunicar las políticas de TI a todas las partes interesadas",
    metrics: "Porcentaje de empleados capacitados en políticas de TI",
    weight: 1.0,
    maturity_levels: {
      0: "No se comunica",
      1: "Comunicación informal",
      2: "Comunicación básica a algunos grupos",
      3: "Comunicación estructurada a todos los grupos relevantes",
      4: "Comunicación monitoreada y medida",
      5: "Comunicación optimizada y adaptativa"
    }
  },
  {
    id: 3,
    process_id: 4,
    control_code: "APO02.01",
    control_statement: "Desarrollar y mantener la estrategia de TI alineada con la estrategia de negocio",
    metrics: "Nivel de alineación medido anualmente, número de iniciativas alineadas",
    weight: 2.0,
    maturity_levels: {
      0: "No hay estrategia documentada",
      1: "Estrategia ad-hoc",
      2: "Estrategia básica pero no alineada",
      3: "Estrategia definida y alineada",
      4: "Estrategia monitoreada y actualizada regularmente",
      5: "Estrategia dinámica y proactiva"
    }
  },
  {
    id: 4,
    process_id: 5,
    control_code: "BAI01.01",
    control_statement: "Establecer y mantener un marco de gestión de proyectos",
    metrics: "Porcentaje de proyectos que cumplen con tiempo y presupuesto",
    weight: 1.2,
    maturity_levels: {
      0: "No hay marco de gestión de proyectos",
      1: "Proyectos gestionados individualmente",
      2: "Algunos procesos de gestión definidos",
      3: "Marco completo definido y documentado",
      4: "Marco implementado y monitoreado",
      5: "Marco optimizado continuamente"
    }
  },
  {
    id: 5,
    process_id: 6,
    control_code: "DSS01.01",
    control_statement: "Monitorear la disponibilidad y desempeño de los servicios de TI",
    metrics: "Porcentaje de disponibilidad medido vs SLA",
    weight: 1.3,
    maturity_levels: {
      0: "No se monitorea",
      1: "Monitoreo reactivo básico",
      2: "Monitoreo básico de algunos servicios",
      3: "Monitoreo completo y documentado",
      4: "Monitoreo proactivo con alertas",
      5: "Monitoreo predictivo y optimizado"
    }
  }
];