// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

// Base de datos simulada
const users = [
  { email: 'test@test.com', password: '12345678', name: 'Usuario Test' }
];

export const handlers = [
  // Login
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return HttpResponse.json({
        token: 'fake-token-123',
        user: { email: user.email, name: user.name }
      }, { status: 200 });
    }
    
    return HttpResponse.json(
      { message: 'Credenciales incorrectas' },
      { status: 401 }
    );
  }),

  // Get user profile
  http.get('/api/profile', ({ request }) => {
    // Simular verificación de token
    const token = request.headers.get('Authorization');
    
    if (token === 'Bearer fake-token-123') {
      return HttpResponse.json({
        email: 'test@test.com',
        name: 'Usuario Test'
      }, { status: 200 });
    }
    
    return HttpResponse.json(
      { message: 'No autorizado' },
      { status: 401 }
    );
  })
];