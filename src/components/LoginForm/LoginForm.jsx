import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        auth: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.email) {
            newErrors.email = 'El email es obligatorio';
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Por favor ingresa un email válido';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
            isValid = false;
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setErrors(prev => ({
                    ...prev,
                    auth: result.error || 'Error al iniciar sesión'
                }));
            }
        } catch {
            setErrors(prev => ({
                ...prev,
                auth: 'Error al conectar con el servidor'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='bg-zinc-900 pt-54 h-dvh'>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-zinc-800 rounded-lg shadow-md">
                {errors.auth && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.auth}
                    </div>
                )}
                <div className='max-w-xs mx-auto'>

                    <h2 className='text-xl text-white uppercase font-semibold text-center underline underline-offset-8 decoration-green-500 mb-12'>Ingresar</h2>

                    <div className="mb-6">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-5 py-3 border rounded-full bg-white focus:outline-none focus:ring-2 ${
                                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Correo electrónico"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-10">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-5 py-3 border rounded-full bg-white focus:outline-none focus:ring-2 ${
                                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Contraseña"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        id='login'
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-green-500 text-white py-3 px-4 mb-6 cursor-pointer uppercase font-semibold transition-all duration-0.3s rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </div>

                <div className='text-center'>
                    <p className='text-white text-sm mb-4'>
                        ¿No tienes cuenta? <a href="/register" className="text-green-500 hover:underline">Crear cuenta</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;