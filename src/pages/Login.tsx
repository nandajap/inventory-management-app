import React, { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="text-2xl sm:text-3xl  font-bold text-center">Sign In</h2>
                    <div className="mt-2 space-y-1">
                        <p className="text-center text-xs sm:text-sm text-gray-600">
                            Admin: admin@test.com / admin123
                        </p>
                        <p className="text-center text-xs sm:text-sm text-gray-600">
                            Viewer: viewer@test.com / viewer123
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label.Root htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </Label.Root>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            disabled={isSubmitting}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label.Root htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </Label.Root>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            disabled={isSubmitting}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};
