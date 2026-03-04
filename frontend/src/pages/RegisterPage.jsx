import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { name, email, password, confirmPassword } = formData;
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess || user) {
            navigate('/');
        }
        return () => {
            dispatch(reset());
        };
    }, [user, isSuccess, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setLocalError('');
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        dispatch(register({ name, email, password }));
    };

    const errorMsg = localError || (isError ? message : '');

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <h1 className="text-xl font-semibold text-white">Create account</h1>
                    <p className="text-surface-500 text-sm mt-1">
                        Start tracking your DSA journey
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-surface-400 font-medium mb-1.5">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors outline-none"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-surface-400 font-medium mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-surface-400 font-medium mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength={6}
                            className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-surface-400 font-medium mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                            className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm py-2.5 rounded-lg transition-colors duration-200"
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-sm text-surface-500 mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
