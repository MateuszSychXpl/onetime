const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {
  let server;
  let messageId;
  
  beforeAll(() => {
    server = app.listen(3001);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should create a new message via API', async () => {
    const response = await request(app)
      .post('/api/share')
      .send({ text: 'Test API message' })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('link');
    messageId = response.body.id;
  });

  it('should retrieve a message via API', async () => {
    const response = await request(app)
      .get(`/api/view/${messageId}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Test API message');
  });

  it('should not find a message after it has been viewed', async () => {
    await request(app)
      .get(`/api/view/${messageId}`)
      .expect(404);
  });

  it('should handle PIN protected messages', async () => {
    const createResponse = await request(app)
      .post('/api/share')
      .send({ text: 'PIN protected message', pin: '1234' })
      .expect(200);

    const viewResponse = await request(app)
      .get(`/api/view/${createResponse.body.id}`)
      .expect(200);

    expect(viewResponse.body).toHaveProperty('pinProtected', true);

    const incorrectPinResponse = await request(app)
      .post(`/api/view/${createResponse.body.id}`)
      .send({ pin: '4321' })
      .expect(400);

    const correctPinResponse = await request(app)
      .post(`/api/view/${createResponse.body.id}`)
      .send({ pin: '1234' })
      .expect(200);

    expect(correctPinResponse.body).toHaveProperty('message', 'PIN protected message');
  });

  it('should return 400 for empty message', async () => {
    await request(app)
      .post('/api/share')
      .send({ text: '' })
      .expect(400);
  });

  it('should return 400 for too long message', async () => {
    const longText = 'a'.repeat(10001);
    await request(app)
      .post('/api/share')
      .send({ text: longText })
      .expect(400);
  });
});