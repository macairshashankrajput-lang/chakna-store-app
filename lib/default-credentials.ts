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
];
