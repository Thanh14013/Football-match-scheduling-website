import { useState } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

function ChangePassword() {
  const { updatePassword } = useSupabase()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const newPassword = watch('newPassword', '')
  
  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await updatePassword(data.newPassword)
      
      if (error) throw error
      
      setSuccess(true)
      
      // Chuyển hướng về trang hồ sơ sau 2 giây
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Đổi mật khẩu</h1>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-3 rounded-md mb-4 dark:bg-red-900/20 dark:text-red-400 flex items-center"
          >
            <FaExclamationCircle className="mr-2" />
            <span>{error}</span>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-600 p-3 rounded-md mb-4 dark:bg-green-900/20 dark:text-green-400 flex items-center"
          >
            <FaCheckCircle className="mr-2" />
            <span>Mật khẩu đã được thay đổi thành công! Đang chuyển hướng...</span>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="newPassword"
                type="password"
                className="input pl-10"
                disabled={isLoading || success}
                {...register('newPassword', { 
                  required: 'Vui lòng nhập mật khẩu mới',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                })}
              />
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Xác nhận mật khẩu mới
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
                  required: 'Vui lòng xác nhận mật khẩu mới',
                  validate: value => value === newPassword || 'Mật khẩu xác nhận không khớp'
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <motion.button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </motion.button>
          
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="btn btn-outline-secondary w-full"
            disabled={isLoading}
          >
            Quay lại
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ChangePassword 