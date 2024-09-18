const request = require('supertest');
const app = require('./app');

describe('One-Time Text Share App', () => {
  let server;
  
  beforeAll(() => {
    server = app.listen(3000);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('XPL One-Time Text Share');
    });
  });

  describe('POST /share', () => {
    it('should create a new message and return a link', async () => {
      const response = await request(app)
        .post('/share')
        .send({ text: 'Test message' });
      expect(response.status).toBe(200);
      expect(response.text).toContain('Your one-time link:');
      expect(response.text).toMatch(/\/view\/[a-f0-9]{16}/);
    });

    it('should return 400 if text is empty', async () => {
      const response = await request(app)
        .post('/share')
        .send({ text: '' });
      expect(response.status).toBe(400);
      expect(response.text).toContain('Text is required');
    });

    it('should return 400 if text is too long', async () => {
      const longText = 'a'.repeat(10001);
      const response = await request(app)
        .post('/share')
        .send({ text: longText });
      expect(response.status).toBe(400);
      expect(response.text).toContain('Message too long');
    });
  });

  describe('GET /view/:id', () => {
    it('should return 404 for non-existent message', async () => {
      const response = await request(app).get('/view/nonexistent');
      expect(response.status).toBe(404);
      expect(response.text).toContain('Message not found or already viewed');
    });

    it('should return message content for valid id', async () => {
      const shareResponse = await request(app)
        .post('/share')
        .send({ text: 'Test message' });
      const id = shareResponse.text.match(/\/view\/([a-f0-9]{16})/)[1];
      
      const viewResponse = await request(app).get(`/view/${id}`);
      expect(viewResponse.status).toBe(200);
      expect(viewResponse.text).toContain('Test message');
    });

    it('should delete message after viewing', async () => {
      const shareResponse = await request(app)
        .post('/share')
        .send({ text: 'One-time message' });
      const id = shareResponse.text.match(/\/view\/([a-f0-9]{16})/)[1];
      
      await request(app).get(`/view/${id}`);
      const secondViewResponse = await request(app).get(`/view/${id}`);
      expect(secondViewResponse.status).toBe(404);
      expect(secondViewResponse.text).toContain('Message not found or already viewed');
    });
  });

  describe('Security Tests', () => {
    it('should not allow XSS in messages', async () => {
      const xssScript = '<script>alert("XSS")</script>';
      const shareResponse = await request(app)
        .post('/share')
        .send({ text: xssScript });
      const id = shareResponse.text.match(/\/view\/([a-f0-9]{16})/)[1];
      
      const viewResponse = await request(app).get(`/view/${id}`);
      expect(viewResponse.status).toBe(200);
      expect(viewResponse.text).not.toContain(xssScript);
      expect(viewResponse.text).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should not expose message IDs in error messages', async () => {
      const response = await request(app).get('/view/nonexistent');
      expect(response.status).toBe(404);
      expect(response.text).not.toContain('nonexistent');
    });

    it('should use secure headers', async () => {
      const response = await request(app).get('/');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-xss-protection']).toBe('0');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['strict-transport-security']).toBe('max-age=15552000; includeSubDomains');
    });

    it('should not store PIN in plain text', async () => {
      const pin = '1234';
      const shareResponse = await request(app)
        .post('/share')
        .send({ text: 'Secret message', pin: pin });
      const id = shareResponse.text.match(/\/view\/([a-f0-9]{16})/)[1];
      
      const viewResponse = await request(app).get(`/view/${id}`);
      expect(viewResponse.status).toBe(200);
      expect(viewResponse.text).not.toContain(pin);
    });

    it('should correctly validate hashed PIN', async () => {
      const pin = '1234';
      const shareResponse = await request(app)
        .post('/share')
        .send({ text: 'PIN protected message', pin: pin });
      const id = shareResponse.text.match(/\/view\/([a-f0-9]{16})/)[1];
      
      const viewResponse = await request(app)
        .post(`/view/${id}`)
        .send({ pin: pin });
      expect(viewResponse.status).toBe(200);
      expect(viewResponse.text).toContain('PIN protected message');
    });
  });
});