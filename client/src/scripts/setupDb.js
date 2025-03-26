import { setupDatabase } from '../lib/setupDatabase.js';
import dotenv from 'dotenv';

// Nạp biến môi trường từ file .env
dotenv.config();

// Đặt biến môi trường cho Supabase nếu không có
if (!process.env.SUPABASE_URL) {
  const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('Thiếu các biến môi trường:');
    missingEnvVars.forEach(varName => {
      console.error(`- ${varName}`);
    });
    console.error('\nVui lòng tạo file .env với các biến môi trường trên hoặc đặt chúng trực tiếp trong file setupDatabase.js');
    process.exit(1);
  }
}

console.log('Bắt đầu thiết lập cơ sở dữ liệu...');
setupDatabase()
  .then(() => {
    console.log('Thiết lập cơ sở dữ liệu thành công');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Thiết lập cơ sở dữ liệu thất bại:', error);
    process.exit(1);
  }); 