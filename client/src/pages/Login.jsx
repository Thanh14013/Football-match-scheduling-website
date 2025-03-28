import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa'

function Login() {
  const { signIn } = useSupabase()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null)
  const [successType, setSuccessType] = useState(location.state?.type || 'info')
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Clear the location state after reading it
  useEffect(() => {
    if (location.state?.message) {
      // Reset the location state to avoid showing the message after a page refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data: userData, error: signInError } = await signIn({
        email: data.email,
        password: data.password,
      })
      
      if (signInError) {
        // Kiểm tra nếu lỗi là do email chưa xác nhận
        if (signInError.message?.includes('Email not confirmed')) {
          console.log('Email chưa được xác nhận, đang cố gắng đăng nhập tự động...');
          // Email không được xác nhận, logic xử lý được di chuyển vào SupabaseContext
          throw signInError;
        } else {
          throw signInError;
        }
      }
      
      if (userData) {
        console.log('Login successful')
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle specific Supabase errors with user-friendly messages
      if (error.message?.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Your email is not confirmed. Please check your inbox or try again.')
      } else {
        setError(error.message || 'An error occurred during login. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Log In</h1>
        
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3 rounded-md mb-4 flex items-center ${
                successType === 'success' 
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              }`}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 dark:bg-red-900/20 dark:text-red-400 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={isLoading}
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
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                className="input pl-10"
                disabled={isLoading}
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login