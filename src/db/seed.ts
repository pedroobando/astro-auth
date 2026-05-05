import { db, posts } from './index';

const postsData = [
  {
    userId: 'user-001',
    name: 'Primer post de prueba',
    context: 'Este es el contenido del primer post. Lorem ipsum dolor sit amet.',
    isActive: true,
  },
  {
    userId: 'user-002',
    name: 'Segundo post de prueba',
    context: 'Contenido del segundo post. Consectetur adipiscing elit.',
    isActive: true,
  },
  {
    userId: 'user-001',
    name: 'Post inactivo',
    context: 'Este post está marcado como inactivo.',
    isActive: false,
  },
  {
    userId: 'user-003',
    name: 'Otro post activo',
    context: 'Más contenido de prueba para poblar la base de datos.',
    isActive: true,
  },
  {
    userId: 'user-002',
    name: 'Último post de seed',
    context: 'Post final para completar el seed inicial.',
    isActive: true,
  },
];

async function seed() {
  console.log('🌱 Iniciando seed de posts...');

  // 1. Limpiar la tabla
  await db.delete(posts);
  console.log('🗑️  Tabla posts limpiada');

  // 2. Insertar datos
  await db.insert(posts).values(postsData);
  console.log(`✅ ${postsData.length} posts insertados`);

  console.log('🎉 Seed completado');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
