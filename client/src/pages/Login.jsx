import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import { FaEnvelope, FaLock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

function Login() {
  const { signIn, session, user } = useSupabase()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [successType, setSuccessType] = useState('info')
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Xử lý thông báo từ trang đăng ký chuyển sang
  useEffect(() => {
    console.log('Location state:', location.state);
    if (location.state?.message) {
      // Lưu thông báo vào state
      setSuccessMessage(location.state.message);
      setSuccessType(location.state.type || 'info');
      
      // Xóa state từ location để tránh hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, []);

  // Tự động ẩn thông báo thành công sau một khoảng thời gian
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 8000); // Hiển thị trong 8 giây
    }
    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null) // Xóa thông báo thành công khi bắt đầu đăng nhập
    
    try {
      console.log("Đang đăng nhập với:", data.email);
      
      const { data: userData, error: signInError } = await signIn({
        email: data.email,
        password: data.password,
      })
      
      if (signInError) {
        if (signInError.message?.toLowerCase().includes('email not confirmed')) {
          console.log('Email chưa được xác nhận, vẫn tiếp tục đăng nhập');
          setError('Đang xử lý đăng nhập của bạn...');
          
          setTimeout(() => {
            if (session || user) {
              navigate('/');
            } else {
              setError('Không thể đăng nhập với thông tin này. Vui lòng thử lại.');
            }
          }, 2000);
          
          return;
        } else {
          throw signInError;
        }
      }
      
      if (userData) {
        console.log('Đăng nhập thành công, chuyển hướng đến trang chủ')
        navigate('/')
      } else {
        console.warn('Không có lỗi nhưng cũng không có dữ liệu người dùng');
        setError('Đã xảy ra lỗi đăng nhập không xác định. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error)
      
      if (error.message?.includes('Invalid login credentials')) {
        setError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.')
      } else if (error.message?.includes('rate limit')) {
        setError('Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau một lúc.')
      } else {
        setError(error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Đăng nhập</h1>
        
        {/* Hiển thị thông báo thành công */}
        {successMessage && (
          <div className={`p-3 rounded-md mb-4 flex items-center ${
            successType === 'success' 
              ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            <FaCheckCircle className="mr-2" />
            <span>{successMessage}</span>
          </div>
        )}
        
        {/* Hiển thị thông báo lỗi */}
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
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mật khẩu
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Quên mật khẩu?
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
                {...register('password', { required: 'Mật khẩu không được để trống' })}
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
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login