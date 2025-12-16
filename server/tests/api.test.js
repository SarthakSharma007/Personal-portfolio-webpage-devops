// server/tests/api.test.js
// Backend API Test Suite - Tests for all API routes (using Jest + Supertest)
// Run: cd server && npm test

// ⚠️ NOTE: Tests use mocked DB to avoid needing a live MySQL connection.

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// =============================================
// 🔧 SETUP: Mock dependencies before requiring routes
// =============================================

// Mock the DB pool — mysql2 execute returns [rows, fields], so mock as [[rows]]
jest.mock('../config/db', () => ({
  promisePool: {
    execute: jest.fn(),
    query: jest.fn(),
  },
  testConnection: jest.fn().mockResolvedValue(true),
}));

// Mock email so it does not attempt real SMTP
jest.mock('../config/email', () => ({
  sendNotificationEmail: jest.fn().mockResolvedValue(true),
}));

const { promisePool } = require('../config/db');

// Build a minimal Express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const projectRoutes = require('../routes/projects');
const skillRoutes = require('../routes/skills');
const certRoutes = require('../routes/certifications');
const experienceRoutes = require('../routes/experiences');
const educationRoutes = require('../routes/education');
const messageRoutes = require('../routes/messages');
const authRoutes = require('../routes/auth');

app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);

// =============================================
// 🔑 Helpers
// =============================================
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

function makeToken(payload = { id: 1, role: 'admin' }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
const authHeader = () => ({ 'x-auth-token': makeToken() });

// mysql2 execute returns Promise<[rows, fields]>
// For SELECT: mock as [[rowsArray]] so const [rows] = await execute() gives rowsArray
// For INSERT/UPDATE/DELETE: mock as [[{ insertId, affectedRows }]]

// =============================================
// 🧪 AUTH ROUTE TESTS
// =============================================
describe('POST /api/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-AUTH-01: Returns 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'pass' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('TC-AUTH-02: Returns 400 if password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('TC-AUTH-03: Returns 401 for wrong credentials (user not found)', async () => {
    // SELECT query returns empty rows → user not found
    promisePool.execute.mockResolvedValueOnce([[]]);
    const res = await request(app).post('/api/auth/login').send({ email: 'wrong@test.com', password: 'bad' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('TC-AUTH-04: Returns 200 with token on valid credentials', async () => {
    const bcrypt = require('bcrypt');
    const hashedPass = await bcrypt.hash('correctPass', 10);
    // Return user row from DB
    promisePool.execute.mockResolvedValueOnce([[{ id: 1, email: 'admin@test.com', name: 'Admin', password: hashedPass }]]);
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'correctPass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});

// =============================================
// 🧪 AUTH MIDDLEWARE TESTS
// =============================================
describe('Auth Middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-MW-01: Blocks request with no token - returns 401 (Bug #1 fix check)', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('TC-MW-02: Blocks request with invalid token - returns 401', async () => {
    const res = await request(app).get('/api/messages').set('x-auth-token', 'invalid.token.here');
    expect(res.statusCode).toBe(401);
  });

  test('TC-MW-03: Allows request with valid JWT token', async () => {
    const mockMsgs = [{ id: 1, name: 'Test', email: 't@t.com', message: 'Hi', read_status: 0, created_at: new Date() }];
    promisePool.execute.mockResolvedValueOnce([mockMsgs]);
    const res = await request(app).get('/api/messages').set(authHeader());
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// =============================================
// 🧪 PROJECTS ROUTE TESTS
// =============================================
describe('GET /api/projects', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-PROJ-01: Returns all featured projects successfully', async () => {
    const mockProjects = [{ id: 1, title: 'Test Project', tech_stack: 'React', featured: 1 }];
    // SELECT returns [[rows]] → const [rows] = result → rows = mockProjects
    promisePool.execute.mockResolvedValueOnce([mockProjects]);
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.count).toBe(1);
  });

  test('TC-PROJ-02: Returns 404 for project not found by ID', async () => {
    // Empty result array → rows.length === 0 → 404
    promisePool.execute.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/api/projects/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('TC-PROJ-03: POST project requires auth token', async () => {
    const res = await request(app).post('/api/projects').send({ title: 'P', description: 'D', tech_stack: 'React' });
    expect(res.statusCode).toBe(401);
  });

  test('TC-PROJ-04: POST project returns 400 if required fields missing', async () => {
    const res = await request(app).post('/api/projects').set(authHeader()).send({ title: 'Only Title' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('TC-PROJ-05: POST project creates successfully', async () => {
    // INSERT returns [{ insertId: 5 }]
    promisePool.execute.mockResolvedValueOnce([{ insertId: 5 }]);
    const res = await request(app)
      .post('/api/projects')
      .set(authHeader())
      .send({ title: 'New', description: 'Desc', tech_stack: 'Node.js' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('TC-PROJ-06: DELETE project returns 404 if not found', async () => {
    // affectedRows: 0 → not found → 404
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/api/projects/9999').set(authHeader());
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('TC-PROJ-07: DELETE project succeeds', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/api/projects/1').set(authHeader());
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// =============================================
// 🧪 SKILLS ROUTE TESTS
// =============================================
describe('GET /api/skills', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-SKILL-01: Returns skills with {success,data} format (Bug #2 fix check)', async () => {
    const mockSkills = [
      { id: 1, name: 'Docker', level: 'Advanced', category: 'DevOps' },
      { id: 2, name: 'K8s', level: 'Intermediate', category: 'DevOps' },
    ];
    // SELECT returns [rows] → const [rows] = result → rows = mockSkills (array)
    promisePool.execute.mockResolvedValueOnce([mockSkills]);
    const res = await request(app).get('/api/skills');
    expect(res.statusCode).toBe(200);
    // ✅ Bug Fix verification: must return {success: true, data: [...]}
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  test('TC-SKILL-02: POST skill requires auth', async () => {
    const res = await request(app).post('/api/skills').send({ name: 'K8s', level: 'Advanced', category: 'DevOps' });
    expect(res.statusCode).toBe(401);
  });

  test('TC-SKILL-03: POST skill returns 400 if fields missing', async () => {
    const res = await request(app).post('/api/skills').set(authHeader()).send({ name: 'Docker' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-SKILL-04: POST skill creates successfully', async () => {
    promisePool.execute.mockResolvedValueOnce([{ insertId: 3 }]);
    const res = await request(app)
      .post('/api/skills')
      .set(authHeader())
      .send({ name: 'Terraform', level: 'Intermediate', category: 'IaC' });
    expect(res.statusCode).toBe(201);
  });

  test('TC-SKILL-05: DELETE skill returns 404 if not found', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/api/skills/999').set(authHeader());
    expect(res.statusCode).toBe(404);
  });
});

// =============================================
// 🧪 CERTIFICATIONS ROUTE TESTS
// =============================================
describe('Certifications Route', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-CERT-01: GET certifications returns success', async () => {
    const mockCerts = [{ id: 1, name: 'AWS SAA', issuing_organization: 'AWS', issue_date: '2024-01-01' }];
    promisePool.execute.mockResolvedValueOnce([mockCerts]);
    const res = await request(app).get('/api/certifications');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  test('TC-CERT-02: POST certification requires auth', async () => {
    const res = await request(app).post('/api/certifications').send({ name: 'AWS', issuing_organization: 'Amazon' });
    expect(res.statusCode).toBe(401);
  });

  test('TC-CERT-03: POST certification returns 400 if required fields missing', async () => {
    const res = await request(app).post('/api/certifications').set(authHeader()).send({ name: 'AWS only' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-CERT-04: PUT certification updates successfully (Bug #3 fix check)', async () => {
    // ✅ Bug Fix verification: PUT route now exists
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app)
      .put('/api/certifications/1')
      .set(authHeader())
      .send({ name: 'AWS SAP', issuing_organization: 'Amazon', issue_date: '2024-06-01', credential_id: 'abc123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('TC-CERT-05: DELETE certification removes successfully (Bug #3 fix check)', async () => {
    // ✅ Bug Fix verification: DELETE route now exists
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/api/certifications/1').set(authHeader());
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('TC-CERT-06: DELETE certification returns 404 when not found', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/api/certifications/9999').set(authHeader());
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// =============================================
// 🧪 MESSAGES ROUTE TESTS
// =============================================
describe('Messages Route', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-MSG-01: POST message succeeds with valid data', async () => {
    promisePool.execute.mockResolvedValueOnce([{ insertId: 1 }]);
    const res = await request(app).post('/api/messages').send({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello!'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('TC-MSG-02: POST message returns 400 if name missing', async () => {
    const res = await request(app).post('/api/messages').send({ email: 'a@b.com', message: 'Hi' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('TC-MSG-03: POST message returns 400 if email missing', async () => {
    const res = await request(app).post('/api/messages').send({ name: 'John', message: 'Hi' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-MSG-04: POST message returns 400 if message body missing', async () => {
    const res = await request(app).post('/api/messages').send({ name: 'John', email: 'a@b.com' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-MSG-05: POST message returns 400 for invalid email format', async () => {
    const res = await request(app).post('/api/messages').send({ name: 'John', email: 'not-an-email', message: 'Hi' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-MSG-06: GET messages requires auth', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toBe(401);
  });

  test('TC-MSG-07: GET messages returns all messages for valid admin', async () => {
    const mockMsgs = [
      { id: 1, name: 'John', email: 'j@j.com', message: 'Hi', read_status: 0, created_at: new Date() }
    ];
    promisePool.execute.mockResolvedValueOnce([mockMsgs]);
    const res = await request(app).get('/api/messages').set(authHeader());
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    // count = mockMsgs.length
    expect(res.body.count).toBe(1);
  });

  test('TC-MSG-08: DELETE message returns 404 when not found', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/api/messages/9999').set(authHeader());
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('TC-MSG-09: PUT mark-all-read marks all unread as read', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 3 }]);
    const res = await request(app).put('/api/messages/mark-all-read').set(authHeader());
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.updated).toBe(3);
  });
});

// =============================================
// 🧪 EXPERIENCES ROUTE TESTS
// =============================================
describe('Experiences Route', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-EXP-01: GET experiences returns data', async () => {
    const mockExp = [{ id: 1, title: 'DevOps Intern', company: 'TechCorp', start_date: '2024-01-01' }];
    promisePool.execute.mockResolvedValueOnce([mockExp]);
    const res = await request(app).get('/api/experiences');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  test('TC-EXP-02: POST experience requires auth', async () => {
    const res = await request(app).post('/api/experiences').send({ title: 'Intern', company: 'Corp', start_date: '2024-01-01' });
    expect(res.statusCode).toBe(401);
  });

  test('TC-EXP-03: POST experience returns 400 if required fields missing', async () => {
    const res = await request(app).post('/api/experiences').set(authHeader()).send({ title: 'Intern' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-EXP-04: DELETE experience returns 404 if not found', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/api/experiences/9999').set(authHeader());
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// =============================================
// 🧪 EDUCATION ROUTE TESTS
// =============================================
describe('Education Route', () => {
  beforeEach(() => jest.clearAllMocks());

  test('TC-EDU-01: GET education records returns data', async () => {
    const mockEdu = [{ id: 1, degree: 'B.Tech', institution: 'MIT', start_date: '2020-01-01' }];
    promisePool.execute.mockResolvedValueOnce([mockEdu]);
    const res = await request(app).get('/api/education');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('TC-EDU-02: POST education requires auth', async () => {
    const res = await request(app).post('/api/education').send({ degree: 'B.Tech', institution: 'MIT', start_date: '2020-01-01' });
    expect(res.statusCode).toBe(401);
  });

  test('TC-EDU-03: POST education returns 400 if required fields missing', async () => {
    const res = await request(app).post('/api/education').set(authHeader()).send({ degree: 'B.Tech' });
    expect(res.statusCode).toBe(400);
  });

  test('TC-EDU-04: DELETE education record returns 404 if not found', async () => {
    promisePool.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/api/education/9999').set(authHeader());
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
