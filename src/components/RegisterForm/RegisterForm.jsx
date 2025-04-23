import { useState } from 'react'

export const RegisterForm = () => {

    // Estados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Preparar el cuerpo de la solicitud
        const newUser = {
            email,
            password,
            name
        };

        // Leer usuarios existentes del localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el correo ya está registrado
        const exists = storedUsers.some(user => user.email === email);
            if (exists) {
            setMessage('¡El correo ya está registrado!');
            return;
        }

        // Agregar el nuevo usuario al array
        storedUsers.push(newUser);

        // Guardar el array actualizado en localStorage
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Mostrar mensaje
        setMessage(`Usuario ${name} creado correctamente`);

        // Limpiar campos
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className='bg-zinc-900 pt-48 h-dvh'>
            <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-lg shadow-md text-white">
                <h2 className="text-xl text-white uppercase font-semibold text-center underline underline-offset-8 decoration-green-500 mb-12">Registrarse</h2>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
                    <div className="mb-6">
                        <input
                            id="email"
                            type="email"
                            className="w-full px-5 py-3  bg-white text-zinc-900 rounded-full"
                            value={email}
                            placeholder='Correo electrónico'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            id="password"
                            type="password"
                            className="w-full px-5 py-3  bg-white text-zinc-900 rounded-full"
                            value={password}
                            placeholder='Contraseña'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-10">
                        <input
                            id="name"
                            type="text"
                            className="w-full px-5 py-3  bg-white text-zinc-900 rounded-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder='Nombre'
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 px-4 mb-6 cursor-pointer uppercase font-semibold transition-all duration-0.3s rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Crear Usuario
                    </button>

                    <div className='text-center'>
                        <p className='text-white text-sm mb-4'>
                            ¿Ya tienes una cuenta? <a href="/login" className="text-green-500 hover:underline">Iniciar sesión</a>
                        </p>
                    </div>
                </form>

                {message && <p className="mt-4 text-center">{message}</p>}
            </div>
        </div>
    )
}

export default RegisterForm;