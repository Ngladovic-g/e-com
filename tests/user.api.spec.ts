// tests/user.api.spec.ts
import { test, expect } from '../fixtures/apiFixtures';

test.describe('User API', () => {

  test('should fetch existing user', async ({ userApi }) => {
    const user = await userApi.getUser(1);

    expect(user.id).toBe(1);
    expect(user).toHaveProperty('email');
  });

  test('should create and delete a user', async ({ userApi }) => {
    const created = await userApi.createUser({
      name: 'Nenad Test',
      email: 'nenad.test@example.com',
      role: 'tester',
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Nenad Test');

    // Cleanup
    await userApi.deleteUser(created.id);
  });

  test('should update a user', async ({ userApi }) => {
    const updated = await userApi.updateUser(1, { name: 'Updated Name' });
    expect(updated.name).toBe('Updated Name');
  });
});