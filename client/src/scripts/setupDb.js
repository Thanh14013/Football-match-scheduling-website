import { setupDatabase } from '../lib/setupDatabase.js';

console.log('Starting database setup...');
setupDatabase()
  .then(() => {
    console.log('Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  }); 