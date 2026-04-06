/**
 * Default Admin Credentials
 * These are used for seeding the database with an admin user for testing
 */

export const DEFAULT_ADMIN_CREDENTIALS = {
  name: 'Shashank Rajput',
  email: 'xyz@gmail.com',
  phone: '6307500844',
  password: 'asdfghjkl',
  role: 'admin' as const,
};

export const DEFAULT_TEST_USERS = [
  {
    name: 'Shashank Rajput',
    email: 'xyz@gmail.com',
    phone: '6307500844',
    password: 'asdfghjkl',
    role: 'admin' as const,
  },
  {
    name: 'Test Customer',
    email: 'customer@test.com',
    phone: '9876543210',
    password: 'password123',
    role: 'customer' as const,
  },
  {
    name: 'Test Vendor',
    email: 'vendor@test.com',
    phone: '9876543211',
    password: 'password123',
    role: 'vendor' as const,
  },
];
