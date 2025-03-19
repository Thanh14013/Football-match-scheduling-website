import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

export async function setupDatabase() {
  try {
    // Đọc file SQL
    const sqlFile = path.join(process.cwd(), 'database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Chia file SQL thành các câu lệnh riêng biệt
    const statements = sql.split(';').filter(statement => statement.trim());

    // Thực thi từng câu lệnh SQL
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error('Error executing SQL:', error);
        } else {
          console.log('Successfully executed SQL statement');
        }
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
} 