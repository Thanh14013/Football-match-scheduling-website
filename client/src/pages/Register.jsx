import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheckCircle } from 'react-icons/fa'

function Register() {
  const { signUp } = useSupabase()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password', '')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("Attempting to register user with data:", {
        email: data.email,
        fullName: data.fullName,
        hasPhone: !!data.phone
      });
      
      // Use the signUp function from SupabaseContext
      const { data: userData, error: signUpError } = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone || null
      });
      
      if (signUpError) {
        console.error("Registration error:", signUpError);
        throw signUpError;
      }
      
      if (userData) {
        console.log("Registration successful:", userData);
        
        // Show success message
        setSuccess(true);
        setError(null);
        
        // Redirect to login page after 2 seconds with a message
        setTimeout(() => {
          // Navigate to login page with state data for showing a message
          navigate('/login', { 
            state: { 
              message: 'Registration successful! You can now log in.',
              type: 'success' 
            }
          });
        }, 2000);
      } else {
        throw new Error("No user data returned from registration");
      }
    } catch (error) {
      console.error('Registration error details:', error);
      
      // Handle specific Supabase errors with user-friendly messages
      if (error.message?.includes('email already registered')) {
        setError('This email is already registered. Please use a different email or login.');
      } else if (error.message?.includes('password')) {
        setError('Password error: ' + error.message);
      } else {
        setError(error.message || 'An error occurred during registration. Please try again.');
      }
      
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Create an Account</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-600 p-3 rounded-md mb-4 dark:bg-green-900/20 dark:text-green-400 flex items-center"
          >
            <FaCheckCircle className="mr-2" /> 
            <span>Registration successful! Redirecting to login...</span>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="fullName"
                type="text"
                className="input pl-10"
                disabled={isLoading || success}
                {...register('fullName', { required: 'Full name is required' })}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className="input pl-10"
                disabled={isLoading || success}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                className="input pl-10"
                disabled={isLoading || success}
                {...register('phone')}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                className="input pl-10"
                disabled={isLoading || success}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className="input pl-10"
                disabled={isLoading || success}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading || success}
          >
            {isLoading ? 'Creating account...' : success ? 'Account Created!' : 'Register'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register