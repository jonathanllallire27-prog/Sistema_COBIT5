/**
 * Script para crear la Auditoría de TI de la Municipalidad Distrital
 * con todos los hallazgos y evaluaciones según COBIT 5
 */

require('dotenv').config();
const { sequelize, syncModels } = require('./src/models');
const { Audit, Assessment, Finding, Control, CobitProcess, User } = require('./src/models');
const loadCobitData = require('./src/utils/cobitLoader');

// Datos de los hallazgos por dominio
const HALLAZGOS_MUNICIPALIDAD = [
    // EDM - Evaluar, Dirigir y Monitorear
    {
        process_code: 'EDM01',
        title: 'Ausencia de marco formal de gobierno de TI',
        description: 'No se dispone de un marco formal de gobierno de Tecnologías de la Información que permita dirigir y supervisar el uso de TI de manera alineada a los objetivos institucionales de la municipalidad.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Desarrollar e implementar un marco de gobierno de TI basado en COBIT 5, definiendo roles, responsabilidades y estructuras de toma de decisiones.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'EDM02',
        title: 'Falta de métricas para medir beneficios de TI',
        description: 'No existen métricas ni mecanismos formales que permitan medir los beneficios obtenidos a partir de las inversiones y el uso de las Tecnologías de la Información.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Establecer indicadores clave de desempeño (KPIs) para evaluar el retorno de inversión y los beneficios de las iniciativas de TI.',
        maturity_current: 0,
        maturity_target: 3
    },
    {
        process_code: 'EDM03',
        title: 'Ausencia de gestión de riesgos tecnológicos',
        description: 'No se cuenta con un proceso documentado para la identificación y gestión de riesgos tecnológicos, lo que expone a la municipalidad a incidentes de seguridad y pérdida de información.',
        severity: 'critical',
        likelihood: 5,
        impact: 5,
        action_plan: 'Implementar un proceso formal de gestión de riesgos de TI que incluya identificación, evaluación, tratamiento y monitoreo de riesgos.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'EDM04',
        title: 'Gestión deficiente de recursos tecnológicos',
        description: 'Los recursos tecnológicos disponibles no se gestionan de manera óptima, evidenciándose equipos obsoletos y ausencia de planificación para su renovación.',
        severity: 'medium',
        likelihood: 4,
        impact: 3,
        action_plan: 'Elaborar un plan de renovación tecnológica y establecer políticas de ciclo de vida de activos de TI.',
        maturity_current: 1,
        maturity_target: 3
    },

    // APO - Alinear, Planificar y Organizar
    {
        process_code: 'APO01',
        title: 'Gestión de TI informal sin políticas documentadas',
        description: 'La gestión de Tecnologías de la Información se realiza de manera informal, sin políticas ni procedimientos documentados que regulen su planificación y organización.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Desarrollar y documentar políticas, procedimientos y estándares de TI alineados con las mejores prácticas.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'APO02',
        title: 'Inexistencia de estrategia de TI',
        description: 'No existe una estrategia de TI definida y alineada a los objetivos institucionales, lo que genera decisiones tecnológicas aisladas y reactivas.',
        severity: 'high',
        likelihood: 4,
        impact: 5,
        action_plan: 'Desarrollar un Plan Estratégico de TI (PETI) alineado con el Plan Estratégico Institucional.',
        maturity_current: 0,
        maturity_target: 3
    },
    {
        process_code: 'APO06',
        title: 'Falta de planificación presupuestal para TI',
        description: 'No se evidencia una planificación presupuestal específica para TI, realizándose gastos tecnológicos sin un análisis previo de costos y necesidades.',
        severity: 'medium',
        likelihood: 3,
        impact: 4,
        action_plan: 'Establecer un proceso de planificación presupuestal de TI vinculado al presupuesto institucional.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'APO07',
        title: 'Personal de TI sin plan de capacitación',
        description: 'El personal encargado de TI no cuenta con un plan de capacitación formal, generando dependencia de conocimientos individuales y riesgos operativos.',
        severity: 'medium',
        likelihood: 3,
        impact: 4,
        action_plan: 'Elaborar e implementar un plan de capacitación continua para el personal de TI.',
        maturity_current: 2,
        maturity_target: 3
    },
    {
        process_code: 'APO08',
        title: 'Deficiencias en coordinación TI - Áreas usuarias',
        description: 'Se identifican deficiencias en la coordinación entre el área de TI y las áreas usuarias, ocasionando requerimientos poco claros y retrasos en la atención.',
        severity: 'medium',
        likelihood: 4,
        impact: 3,
        action_plan: 'Establecer un comité de TI con representantes de las áreas usuarias y definir procedimientos de comunicación.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'APO10',
        title: 'Gestión informal de proveedores tecnológicos',
        description: 'La relación con proveedores tecnológicos carece de mecanismos formales de seguimiento y control del cumplimiento de los servicios contratados.',
        severity: 'medium',
        likelihood: 3,
        impact: 3,
        action_plan: 'Implementar un proceso de gestión de proveedores con evaluaciones periódicas de desempeño.',
        maturity_current: 2,
        maturity_target: 3
    },
    {
        process_code: 'APO12',
        title: 'Falta de análisis estructurado de riesgos tecnológicos',
        description: 'No se dispone de un análisis estructurado de riesgos tecnológicos que contemple la confidencialidad, integridad y disponibilidad de la información institucional.',
        severity: 'critical',
        likelihood: 4,
        impact: 5,
        action_plan: 'Realizar un análisis de riesgos de TI basado en metodología ISO 27005 o similar.',
        maturity_current: 1,
        maturity_target: 4
    },
    {
        process_code: 'APO13',
        title: 'Carencia de políticas de seguridad de la información',
        description: 'Se carece de políticas institucionales formales relacionadas con la seguridad de la información, incrementando el riesgo de accesos no autorizados y pérdida de datos.',
        severity: 'critical',
        likelihood: 5,
        impact: 5,
        action_plan: 'Desarrollar e implementar un Sistema de Gestión de Seguridad de la Información (SGSI) basado en ISO 27001.',
        maturity_current: 1,
        maturity_target: 4
    },

    // BAI - Construir, Adquirir e Implementar
    {
        process_code: 'BAI06',
        title: 'Gestión de cambios sin proceso formal',
        description: 'Los cambios realizados en los sistemas y equipos tecnológicos no siguen un proceso formal de evaluación y autorización, generando riesgos de interrupción del servicio.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Implementar un proceso de gestión de cambios con comité de aprobación y procedimientos documentados.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'BAI09',
        title: 'Inventario de activos desactualizado',
        description: 'No existe un inventario actualizado de los activos tecnológicos, dificultando el control, mantenimiento y planificación de renovación de equipos.',
        severity: 'medium',
        likelihood: 4,
        impact: 3,
        action_plan: 'Elaborar y mantener un inventario completo de activos de TI con información de estado y ciclo de vida.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'BAI10',
        title: 'Configuraciones no documentadas',
        description: 'Las configuraciones de los sistemas y equipos no se encuentran documentadas, lo que complica la recuperación ante fallas o incidentes técnicos.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Implementar una base de datos de configuración (CMDB) y documentar las configuraciones críticas.',
        maturity_current: 0,
        maturity_target: 3
    },

    // DSS - Entregar, Dar Soporte y Servicio
    {
        process_code: 'DSS01',
        title: 'Operaciones de TI sin procedimientos definidos',
        description: 'Las operaciones diarias de TI no cuentan con procedimientos definidos, generando dependencia de soluciones improvisadas para mantener la continuidad del servicio.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Documentar y estandarizar los procedimientos operativos de TI.',
        maturity_current: 2,
        maturity_target: 4
    },
    {
        process_code: 'DSS02',
        title: 'Incidentes sin registro ni seguimiento formal',
        description: 'No se registra ni da seguimiento formal a las solicitudes de servicio e incidentes tecnológicos, afectando la eficiencia en su atención.',
        severity: 'medium',
        likelihood: 4,
        impact: 3,
        action_plan: 'Implementar un sistema de gestión de tickets (mesa de ayuda) para registro y seguimiento de incidentes.',
        maturity_current: 1,
        maturity_target: 4
    },
    {
        process_code: 'DSS03',
        title: 'Falta de análisis de causa raíz de problemas',
        description: 'No se realiza un análisis de causa raíz de los problemas recurrentes, limitándose a soluciones temporales que no corrigen el origen de las fallas.',
        severity: 'medium',
        likelihood: 4,
        impact: 3,
        action_plan: 'Implementar un proceso de gestión de problemas con análisis de causa raíz.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'DSS04',
        title: 'Ausencia de planes de continuidad y respaldos',
        description: 'No se dispone de planes de continuidad ni de recuperación ante desastres, ni de respaldos sistemáticos de la información institucional.',
        severity: 'critical',
        likelihood: 4,
        impact: 5,
        action_plan: 'Desarrollar e implementar un Plan de Continuidad del Negocio (BCP) y Plan de Recuperación ante Desastres (DRP).',
        maturity_current: 0,
        maturity_target: 4
    },
    {
        process_code: 'DSS05',
        title: 'Controles de seguridad limitados',
        description: 'Los controles de seguridad aplicados a los sistemas y equipos son limitados, incrementando el riesgo de incidentes de seguridad informática.',
        severity: 'critical',
        likelihood: 5,
        impact: 5,
        action_plan: 'Implementar controles de seguridad técnicos y administrativos basados en estándares internacionales.',
        maturity_current: 2,
        maturity_target: 4
    },

    // MEA - Monitorear, Evaluar y Valorar
    {
        process_code: 'MEA01',
        title: 'Falta de indicadores de desempeño de TI',
        description: 'No se utilizan indicadores para monitorear el desempeño de las Tecnologías de la Información, dificultando la evaluación de su efectividad.',
        severity: 'medium',
        likelihood: 4,
        impact: 3,
        action_plan: 'Definir e implementar un cuadro de mando integral (BSC) para TI con indicadores clave.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'MEA02',
        title: 'Debilidades en control interno de TI',
        description: 'El sistema de control interno relacionado con TI presenta debilidades, evidenciándose falta de seguimiento a los controles existentes.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Fortalecer el sistema de control interno de TI con auditorías periódicas y planes de mejora.',
        maturity_current: 1,
        maturity_target: 3
    },
    {
        process_code: 'MEA03',
        title: 'Incumplimiento de normativas sin verificación',
        description: 'No se ha verificado de manera sistemática el cumplimiento de las normas y disposiciones legales aplicables al uso de la información y las Tecnologías de la Información en la municipalidad.',
        severity: 'high',
        likelihood: 4,
        impact: 4,
        action_plan: 'Establecer un programa de cumplimiento normativo con verificaciones periódicas.',
        maturity_current: 1,
        maturity_target: 3
    }
];

// Función principal
const createMunicipalidadAudit = async () => {
    try {
        console.log('\n🚀 Iniciando creación de auditoría de la Municipalidad Distrital...\n');

        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Sincronizar modelos
        await syncModels(false);
        console.log('✅ Modelos sincronizados');

        // Cargar datos COBIT
        await loadCobitData();
        console.log('✅ Datos COBIT cargados');

        // Buscar o crear usuario administrador
        let adminUser = await User.findOne({ where: { email: 'admin@cobit.com' } });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Administrador del Sistema',
                email: 'admin@cobit.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Usuario administrador creado');
        }

        // Obtener todos los procesos COBIT para el scope
        const allProcesses = await CobitProcess.findAll();
        const processIds = allProcesses.map(p => p.id);
        console.log(`✅ ${allProcesses.length} procesos COBIT encontrados`);

        // Crear la auditoría
        const audit = await Audit.create({
            name: 'Auditoría de Gestión de TI - Municipalidad Distrital',
            description: 'Auditoría integral a la gestión de Tecnologías de la Información de la Municipalidad Distrital, basada en el marco de trabajo COBIT 5. Esta auditoría evalúa los 5 dominios de COBIT: EDM (Evaluar, Dirigir y Monitorear), APO (Alinear, Planificar y Organizar), BAI (Construir, Adquirir e Implementar), DSS (Entregar, Dar Soporte y Servicio) y MEA (Monitorear, Evaluar y Valorar).',
            start_date: new Date('2024-11-01'),
            end_date: new Date('2024-12-31'),
            status: 'in_progress',
            scope_processes: processIds,
            scoring_config: {
                compliant: 100,
                partially_compliant: 50,
                non_compliant: 0,
                not_applicable: null
            },
            created_by: adminUser.id
        });
        console.log(`✅ Auditoría creada: ${audit.name} (ID: ${audit.id})`);

        // Crear evaluaciones (assessments) para todos los controles
        const controls = await Control.findAll({
            include: [CobitProcess]
        });

        console.log(`📋 Creando ${controls.length} evaluaciones de control...`);

        for (const control of controls) {
            // Determinar nivel de cumplimiento basado en el hallazgo correspondiente
            const hallazgo = HALLAZGOS_MUNICIPALIDAD.find(h =>
                control.control_code.startsWith(h.process_code)
            );

            let compliance = 'non_compliant';
            let score = 1;

            if (hallazgo) {
                if (hallazgo.maturity_current >= 3) {
                    compliance = 'compliant';
                    score = 4;
                } else if (hallazgo.maturity_current >= 2) {
                    compliance = 'partially_compliant';
                    score = 2;
                }
            }

            await Assessment.create({
                audit_id: audit.id,
                control_id: control.id,
                status: 'completed',
                compliance,
                score,
                notes: hallazgo
                    ? `Nivel de madurez actual: ${hallazgo.maturity_current} - ${getMaturiyLabel(hallazgo.maturity_current)}. Nivel deseado: ${hallazgo.maturity_target} - ${getMaturiyLabel(hallazgo.maturity_target)}.`
                    : 'Control evaluado sin hallazgos específicos asociados.'
            });
        }
        console.log(`✅ ${controls.length} evaluaciones creadas`);

        // Crear los hallazgos
        console.log(`📋 Creando ${HALLAZGOS_MUNICIPALIDAD.length} hallazgos...`);

        for (const hallazgoData of HALLAZGOS_MUNICIPALIDAD) {
            // Buscar el control asociado
            const control = await Control.findOne({
                where: {
                    control_code: {
                        [require('sequelize').Op.like]: `${hallazgoData.process_code}%`
                    }
                }
            });

            await Finding.create({
                audit_id: audit.id,
                control_id: control?.id || null,
                title: hallazgoData.title,
                description: hallazgoData.description,
                severity: hallazgoData.severity,
                likelihood: hallazgoData.likelihood,
                impact: hallazgoData.impact,
                status: 'open',
                action_plan: hallazgoData.action_plan,
                due_date: new Date('2025-06-30'),
                owner_id: adminUser.id
            });
        }
        console.log(`✅ ${HALLAZGOS_MUNICIPALIDAD.length} hallazgos creados`);

        // Resumen final
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN DE LA AUDITORÍA CREADA');
        console.log('='.repeat(60));
        console.log(`📌 Nombre: ${audit.name}`);
        console.log(`📌 ID: ${audit.id}`);
        console.log(`📌 Estado: ${audit.status}`);
        console.log(`📌 Procesos en alcance: ${processIds.length}`);
        console.log(`📌 Evaluaciones creadas: ${controls.length}`);
        console.log(`📌 Hallazgos registrados: ${HALLAZGOS_MUNICIPALIDAD.length}`);
        console.log('='.repeat(60));

        // Estadísticas por severidad
        const criticalCount = HALLAZGOS_MUNICIPALIDAD.filter(h => h.severity === 'critical').length;
        const highCount = HALLAZGOS_MUNICIPALIDAD.filter(h => h.severity === 'high').length;
        const mediumCount = HALLAZGOS_MUNICIPALIDAD.filter(h => h.severity === 'medium').length;
        const lowCount = HALLAZGOS_MUNICIPALIDAD.filter(h => h.severity === 'low').length;

        console.log('\n📊 HALLAZGOS POR SEVERIDAD:');
        console.log(`   🔴 Críticos: ${criticalCount}`);
        console.log(`   🟠 Altos: ${highCount}`);
        console.log(`   🟡 Medios: ${mediumCount}`);
        console.log(`   🟢 Bajos: ${lowCount}`);

        // Estadísticas por dominio
        console.log('\n📊 HALLAZGOS POR DOMINIO:');
        const byDomain = HALLAZGOS_MUNICIPALIDAD.reduce((acc, h) => {
            const domain = h.process_code.substring(0, 3);
            acc[domain] = (acc[domain] || 0) + 1;
            return acc;
        }, {});

        Object.entries(byDomain).forEach(([domain, count]) => {
            const domainNames = {
                'EDM': 'Evaluar, Dirigir y Monitorear',
                'APO': 'Alinear, Planificar y Organizar',
                'BAI': 'Construir, Adquirir e Implementar',
                'DSS': 'Entregar, Dar Soporte y Servicio',
                'MEA': 'Monitorear, Evaluar y Valorar'
            };
            console.log(`   ${domain} - ${domainNames[domain]}: ${count} hallazgos`);
        });

        console.log('\n✅ ¡Auditoría de la Municipalidad creada exitosamente!');
        console.log(`\n🌐 Puedes ver la auditoría en: http://localhost:3000/audits/${audit.id}`);
        console.log(`📄 Generar informe en: http://localhost:3000/reports\n`);

    } catch (error) {
        console.error('❌ Error creando la auditoría:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

// Helper para obtener etiqueta de madurez
function getMaturiyLabel(level) {
    const labels = {
        0: 'Inexistente',
        1: 'Inicial',
        2: 'Repetible',
        3: 'Definido',
        4: 'Gestionado',
        5: 'Optimizado'
    };
    return labels[level] || 'Desconocido';
}

// Ejecutar
createMunicipalidadAudit();
