import mongoose from 'mongoose';
import { config } from '../config';
import Permission from '../modules/auth/models/permission.model';

const permissions = [
  // Role permissions
  {
    name: 'role.create',
    description: 'Create new roles',
  },
  {
    name: 'role.read',
    description: 'View roles',
  },
  {
    name: 'role.update',
    description: 'Update existing roles',
  },
  {
    name: 'role.delete',
    description: 'Delete roles',
  },

  // Permission permissions
  {
    name: 'permission.create',
    description: 'Create new permissions',
  },
  {
    name: 'permission.read',
    description: 'View permissions',
  },
  {
    name: 'permission.update',
    description: 'Update existing permissions',
  },
  {
    name: 'permission.delete',
    description: 'Delete permissions',
  },

  // User permissions
  {
    name: 'user.approve',
    description: 'Approve user registrations',
  },
  {
    name: 'user.read',
    description: 'View user details',
  },
  {
    name: 'user.update',
    description: 'Update user details',
  },
  {
    name: 'user.delete',
    description: 'Delete users',
  },
];

async function seedPermissions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database.url);
    console.log('Connected to MongoDB');

    // Create permissions
    for (const permission of permissions) {
      await Permission.findOneAndUpdate({ name: permission.name }, permission, {
        upsert: true,
        new: true,
      });
      console.log(`Created/Updated permission: ${permission.name}`);
    }

    console.log('All permissions seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding permissions:', error);
    process.exit(1);
  }
}

seedPermissions();
