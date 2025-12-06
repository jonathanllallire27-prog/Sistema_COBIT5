#!/usr/bin/env node
require('dotenv').config();
const { sequelize, Audit, Assessment, Control, User } = require('./src/models');
const bcrypt = require('bcryptjs');

const testAuditCreation = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa\n');

    // Buscar o crear un usuario para la prueba
    let user = await User.findOne({ where: { email: 'admin@cobit.com' } });
    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await User.create({
        name: 'Administrador',
        email: 'admin@cobit.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Usuario administrador creado');
    }

    // Crear una auditoría de prueba
    console.log('\n📝 Creando auditoría de prueba...');
    const audit = await Audit.create({
      name: 'Auditoría de Prueba',
      description: 'Auditoría para verificar que los controles se crean',
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      scope_processes: [],  // Sin procesos específicos para que use todos los controles
      created_by: user.id,
      status: 'planned'
    });
    console.log(`✅ Auditoría creada: ${audit.name} (ID: ${audit.id})`);

    // Obtener todos los controles
    console.log('\n📋 Obtener controles...');
    const controls = await Control.findAll();
    console.log(`   - Encontrados: ${controls.length} controles`);

    // Crear evaluaciones para todos los controles
    console.log('\n📝 Creando evaluaciones...');
    const assessments = controls.map(control => ({
      audit_id: audit.id,
      control_id: control.id,
      status: 'pending'
    }));

    const createdAssessments = await Assessment.bulkCreate(assessments);
    console.log(`✅ Evaluaciones creadas: ${createdAssessments.length}`);

    // Verificar que se pueden recuperar
    console.log('\n🔍 Verificando evaluaciones...');
    const retrievedAssessments = await Assessment.findAll({
      where: { audit_id: audit.id },
      include: [Control]
    });
    console.log(`✅ Evaluaciones recuperadas: ${retrievedAssessments.length}`);
    console.log(`   - Primera: ${retrievedAssessments[0]?.Control?.control_code} - ${retrievedAssessments[0]?.Control?.control_statement?.substring(0, 50)}...`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

testAuditCreation();
