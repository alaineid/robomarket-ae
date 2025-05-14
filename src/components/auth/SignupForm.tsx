'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from "@/components/SSOButtons";
import { useGlobal } from '@/lib/context/GlobalContext';
import * as EmailValidator from 'email-validator';
import zxcvbn from 'zxcvbn';

export default function SignupForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [hasCapital, setHasCapital] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasMinLength, setHasMinLength] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const router = useRouter();
    const { user } = useGlobal();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            router.push('/shop');
        }
    }, [user, router]);

    // Validate email as user types
    useEffect(() => {
        if (email) {
            setEmailValid(EmailValidator.validate(email));
        } else {
            setEmailValid(true);
        }
    }, [email]);

    // Check password strength and requirements on change
    useEffect(() => {
        if (password) {
            const result = zxcvbn(password);
            setPasswordStrength(result.score);

            const feedback = [];
            if (result.feedback.warning) feedback.push(result.feedback.warning);
            if (result.feedback.suggestions.length > 0) feedback.push(...result.feedback.suggestions);
            setPasswordFeedback(feedback);

            setHasSpecialChar(/[^A-Za-z0-9]/.test(password));
            setHasCapital(/[A-Z]/.test(password));
            setHasNumber(/[0-9]/.test(password));
            setHasMinLength(password.length >= 8);
        } else {
            setPasswordStrength(0);
            setPasswordFeedback([]);
            setHasSpecialChar(false);
            setHasCapital(false);
            setHasNumber(false);
            setHasMinLength(false);
        }
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!firstName || !lastName || !email || !password) {
            setError('All fields are required');
            return;
        }

        if (!EmailValidator.validate(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!hasMinLength || !hasSpecialChar || !hasCapital || !hasNumber) {
            setError('Your password must meet all the requirements listed below');
            return;
        }

        if (passwordStrength < 2) {
            setError('Password is too weak. Please choose a stronger password.');
            return;
        }

        if (!acceptedTerms) {
            setError('You must accept the Terms of Service and Privacy Policy');
            return;
        }

        try {
            setLoading(true);

            const supabase = await createSPASassClient();

            // Check if the user already exists
            const { data: userData, error: userError } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false }
            });

            if (!userError && userData) {
                setError('An account with this email already exists. Please log in instead.');
                setLoading(false);
                return;
            }

            // Register the user
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`,
                    }
                }
            });

            if (signupError) {
                if (
                    signupError.message.toLowerCase().includes('user already registered') ||
                    signupError.message.toLowerCase().includes('already exists') ||
                    signupError.message.toLowerCase().includes('already registered') ||
                    signupError.message.toLowerCase().includes('duplicate') ||
                    signupError.status === 400
                ) {
                    setError('An account with this email already exists. Please log in instead.');
                } else {
                    throw signupError;
                }
                return;
            }

            if (data.user) {
                setSuccessMessage('Registration successful! Please check your email for verification.');
                setTimeout(() => {
                    router.push('/auth/verify-email');
                }, 3000);
            }
        } catch (err: unknown) {
            console.error('Error during signup:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during signup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage ? (
                <div className="text-center">
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                        <p>{successMessage}</p>
                    </div>
                    <p className="mb-4">You will be redirected to the login page...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full rounded-md px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                !emailValid && email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {!emailValid && email && (
                            <p className="text-xs text-red-600 mt-1">Please enter a valid email address</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    {/* Terms */}
                    <div className="flex items-start">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                            I agree to the{' '}
                            <Link href="/legal/terms" className="font-medium text-primary-600 hover:text-primary-500">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/legal/privacy" className="font-medium text-primary-600 hover:text-primary-500">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            )}

            <SSOButtons onError={setError} />

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account?</span>{' '}
                <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in
                </Link>
            </div>
        </div>
    );
}