// src/mocks/handlers.js

import { http, HttpResponse } from 'msw';

// Base de datos simulada (Array de usuarios guardados en localStorage)
let users = JSON.parse(localStorage.getItem('users')) || [];  // Verificamos si hay usuarios guardados en el localStorage

export const handlers = [
  
  // Endpoint de Login: Simula la autenticación del usuario
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    // Leemos los usuarios almacenados en localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Buscamos al usuario que coincida con el email y la contraseña proporcionada
    const user = storedUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Si encontramos al usuario, retornamos un token simulado
      return HttpResponse.json({
        token: 'fake-token-123',  // Token falso para la simulación
        user: { email: user.email, name: user.name }
      }, { status: 200 });
    }
    
    // Si no se encuentran las credenciales, retornamos un error
    return HttpResponse.json(
      { message: 'Credenciales incorrectas' },
      { status: 401 }
    );
  }),

  // Endpoint para obtener el perfil del usuario
  http.get('/api/profile', ({ request }) => {
    const token = request.headers.get('Authorization');
    
    if (token) {
      // Si existe un token, buscamos el usuario asociado con ese token
      const storedUser = users.find(user => user.token === token);

      if (storedUser) {
        // Si encontramos al usuario, retornamos su perfil
        return HttpResponse.json(storedUser, { status: 200 });
      }
    }

    // Si no se encuentra el usuario, retornamos un error
    return HttpResponse.json(
      { message: 'No autorizado' },
      { status: 401 }
    );
  }),

  // Endpoint para crear un nuevo usuario
  http.post('/api/users/create', async ({ request }) => {
    const newUser = await request.json();
    
    // Validación sencilla para asegurarnos de que todos los campos sean proporcionados
    if (!newUser.email || !newUser.password || !newUser.name) {
      return HttpResponse.json(
        { message: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Si todos los campos son válidos, agregamos el nuevo usuario al array
    users.push(newUser);

    // Guardamos la lista de usuarios actualizada en localStorage
    localStorage.setItem('users', JSON.stringify(users));

    return HttpResponse.json({ message: 'Usuario creado correctamente', user: newUser }, { status: 201 });
  }),

  // Endpoint para obtener el contador de usuarios
  http.get('/api/users/count', () => {
    try {
      // Obtenemos el número de usuarios almacenados en localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      return HttpResponse.json({ count: storedUsers.length });
    } catch (err) {
      // Si hay un error al leer el localStorage, retornamos un error
      return new HttpResponse(
        JSON.stringify({ message: 'Error al leer usuarios' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }),
];
