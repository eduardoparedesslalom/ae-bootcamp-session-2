const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

// Helper: create an item and return it
const createItem = async (name = 'Test Item') => {
  const response = await request(app)
    .post('/api/items')
    .send({ name })
    .set('Accept', 'application/json');
  expect(response.status).toBe(201);
  return response.body;
};

describe('PUT /api/items/:id', () => {
  it('should update an existing item and return the updated item', async () => {
    const item = await createItem('Original Name');

    const response = await request(app)
      .put(`/api/items/${item.id}`)
      .send({ name: 'Updated Name' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(item.id);
    expect(response.body.name).toBe('Updated Name');
    expect(response.body).toHaveProperty('created_at');
  });

  it('should trim whitespace from the updated name', async () => {
    const item = await createItem('Trim Test');

    const response = await request(app)
      .put(`/api/items/${item.id}`)
      .send({ name: '  Trimmed  ' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Trimmed');
  });

  it('should return 404 when updating a non-existent item', async () => {
    const response = await request(app)
      .put('/api/items/999999')
      .send({ name: 'Does Not Exist' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Item not found');
  });

  it('should return 400 when name is missing', async () => {
    const item = await createItem('Name Required Test');

    const response = await request(app)
      .put(`/api/items/${item.id}`)
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Item name is required');
  });

  it('should return 400 when name is an empty string', async () => {
    const item = await createItem('Empty Name Test');

    const response = await request(app)
      .put(`/api/items/${item.id}`)
      .send({ name: '' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Item name is required');
  });

  it('should return 400 when name is whitespace only', async () => {
    const item = await createItem('Whitespace Name Test');

    const response = await request(app)
      .put(`/api/items/${item.id}`)
      .send({ name: '   ' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Item name is required');
  });

  it('should return 400 when id is not a valid number', async () => {
    const response = await request(app)
      .put('/api/items/not-a-number')
      .send({ name: 'Valid Name' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Valid item ID is required');
  });
});
