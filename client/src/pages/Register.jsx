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
      console.log("Đang đăng ký tài khoản:", {
        email: data.email,
        fullName: data.fullName,
        hasPhone: !!data.phone
      });
      
      // Đăng ký tài khoản mới
      const { data: userData, error: signUpError } = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone || null
      });
      
      if (signUpError) {
        console.error("Lỗi đăng ký:", signUpError);
        throw signUpError;
      }
      
      if (userData) {
        console.log("Đăng ký thành công:", userData);
        
        // Hiển thị thông báo thành công
        setSuccess(true);
        setError(null);
        
        // Đợi một khoảng thời gian ngắn để người dùng thấy thông báo thành công
        setTimeout(() => {
          // Chuyển hướng đến trang đăng nhập và truyền thông báo
          navigate('/login', { 
            state: { 
              message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.',
              type: 'success' 
            }
          });
        }, 2000);
      } else {
        throw new Error("Không nhận được dữ liệu người dùng từ quá trình đăng ký");
      }
    } catch (error) {
      console.error('Chi tiết lỗi đăng ký:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.message?.includes('email already registered')) {
        setError('Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.');
      } else if (error.message?.includes('password')) {
        setError('Lỗi mật khẩu: ' + error.message);
      } else {
        setError(error.message || 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.');
      }
      
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Tạo tài khoản mới</h1>
        
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
            <span>Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...</span>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Họ và tên
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
                {...register('fullName', { required: 'Họ và tên không được để trống' })}
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
                  required: 'Email không được để trống',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Địa chỉ email không hợp lệ'
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
              Số điện thoại (tùy chọn)
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
              Mật khẩu
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
                  required: 'Mật khẩu không được để trống',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
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
              Xác nhận mật khẩu
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
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: value => value === password || 'Mật khẩu không khớp'
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
            {isLoading ? 'Đang tạo tài khoản...' : success ? 'Đã tạo tài khoản!' : 'Đăng ký'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register