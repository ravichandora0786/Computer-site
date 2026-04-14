import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const up = async ({ context: queryInterface }) => {
  const adminRoleId = uuidv4();
  const teacherRoleId = uuidv4();
  const studentRoleId = uuidv4();
  
  // Insert Roles
  await queryInterface.bulkInsert('roles', [
    {
      id: adminRoleId,
      name: 'Main Admin',
      type: 'admin',
      description: 'System generated super admin role',
      isActive: true,
      isSystemLogin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: teacherRoleId,
      name: 'Teacher',
      type: 'teacher',
      description: 'Role for course instructors',
      isActive: true,
      isSystemLogin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: studentRoleId,
      name: 'Student',
      type: 'student',
      description: 'Default role for enrolled students',
      isActive: true,
      isSystemLogin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Insert Users
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  await queryInterface.bulkInsert('users', [
    {
      id: uuidv4(),
      user_name: 'Super Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      account_status: 'active',
      role_id: adminRoleId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      user_name: 'Main Teacher',
      email: 'teacher@co.com',
      password: hashedPassword,
      account_status: 'active',
      role_id: teacherRoleId,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      user_name: 'Example Student',
      email: 'student@co.com',
      password: hashedPassword,
      account_status: 'active',
      role_id: studentRoleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('users', { 
    email: ['admin@admin.com', 'teacher@co.com', 'student@co.com'] 
  }, {});
  await queryInterface.bulkDelete('roles', { 
    name: ['Main Admin', 'Teacher', 'Student'] 
  }, {});
};
