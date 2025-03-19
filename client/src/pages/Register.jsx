import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'

function Register() {
  const { signUp } = useSupabase()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password', '')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      })
      
      if (error) throw error
      
      // In a real app with email confirmation, we would redirect to a confirmation page
      // For this demo, we'll just redirect to login
      navigate('/login')
    } catch (error) {
      setError(error.message || 'An error occurred during registration')
    } finally {
      setIsLoading(false)
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="input"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
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