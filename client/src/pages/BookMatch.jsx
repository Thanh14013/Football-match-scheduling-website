import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { motion } from 'framer-motion'
import FadeIn from '../components/animations/FadeIn'
import Skeleton from '../components/Skeleton'

function BookMatch() {
  console.log('BookMatch component rendered');
  const { user, supabase } = useSupabase()
  const navigate = useNavigate()
  const location = useLocation()
  // Lấy match object từ state hoặc thử lấy matchId từ URL
  const matchFromState = location.state?.match;
  const params = new URLSearchParams(location.search)
  const matchIdFromUrl = params.get('matchId');

  const [match, setMatch] = useState(matchFromState || null)
  const [isLoading, setIsLoading] = useState(!matchFromState) // Loading chỉ nếu chưa có match object
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [numberOfTickets, setNumberOfTickets] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [userBookings, setUserBookings] = useState([]); // State để lưu lịch sử đặt vé của người dùng
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Xử lý khi component mount hoặc matchFromState thay đổi
  useEffect(() => {
    // Nếu match object đã có từ state, không cần fetch
    if (matchFromState) {
      setIsLoading(false);
      if (matchFromState.stadiums?.price) {
        setTotalPrice(matchFromState.stadiums.price * numberOfTickets);
      }
    }

    // Load user's bookings from localStorage on mount
    const storedBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    if (user?.id) {
        // Filter bookings belonging to the current logged-in user (simulated)
        const currentUserBookings = storedBookings.filter(booking => booking.user_id === user.id);
        setUserBookings(currentUserBookings);
    } else {
        setUserBookings([]); // Clear bookings if no user is logged in
    }

    // Nếu không có match object từ state, thử dùng matchId từ URL (chỉ cho mục đích gỡ lỗi hoặc fallback)
    if (!matchFromState && matchIdFromUrl) {
        setIsLoading(false);
        setError('Match data could not be loaded from sample. Please try again.');
    }

  }, [matchFromState, matchIdFromUrl, user]); // Thêm user vào dependency để load lại khi đăng nhập/xuất

  // Update total price when number of tickets changes
  useEffect(() => {
    if (match?.stadiums?.price) {
      setTotalPrice(match.stadiums.price * numberOfTickets);
    }
  }, [numberOfTickets, match]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!user || !match) {
        setError('User or match information is missing.')
        setIsSubmitting(false)
        return
      }

      // --- Bắt đầu mô phỏng lưu booking với dữ liệu mẫu ---
      console.log('Simulating saving booking with sample data for match:', match.id, 'tickets:', numberOfTickets, 'notes:', data.notes);

      // Tạo một booking object tạm thời
      const tempBooking = {
        id: Date.now(), // ID giả (dùng timestamp)
        created_at: new Date().toISOString(),
        user_id: user.id, // Vẫn dùng user id thật nếu đăng nhập
        match_id: match.id, // ID trận đấu mẫu (số nguyên)
        match: match, // Lưu toàn bộ object trận đấu mẫu
        number_of_tickets: numberOfTickets,
        total_price: totalPrice,
        notes: data.notes,
        status: 'pending'
      };

      // Lưu booking object tạm thời vào sessionStorage để chuyển sang trang thanh toán
      sessionStorage.setItem('tempBookingData', JSON.stringify(tempBooking));

      setError(null); // Clear any previous errors

      // Chuyển hướng đến trang thanh toán
      setTimeout(() => {
        // Truyền booking object tạm thời qua state khi chuyển hướng
        navigate('/payment', { state: { bookingData: tempBooking } });
      }, 500); // Chờ 0.5 giây trước khi chuyển hướng

      // --- Kết thúc mô phỏng lưu booking ---

    } catch (error) {
      console.error('Unexpected error during booking simulation:', error)
      setError('An unexpected error occurred during booking simulation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0]

  // Nếu không có match object, hiển thị thông báo lỗi ban đầu
  if (!match) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Match not found</h2>
        {error && <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>}
        {!error && <p className="mb-6 text-gray-600 dark:text-gray-300">Please go back and choose a match to book tickets.</p>}
        <button onClick={() => navigate('/schedule')} className="btn btn-primary">Back to Schedule</button>
      </div>
    )
  }

  // --- Giao diện đặt vé khi có match object ---
  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        Book Tickets
      </motion.h1>
      {isLoading ? (
        <Skeleton height="32px" className="mb-4" />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      ) : match && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={match.club1?.logo_url} alt={match.club1?.name} className="h-12 w-12 object-contain" />
            <span className="font-bold text-lg">{match.club1?.name}</span>
            <span className="mx-2 text-gray-500 font-semibold">vs</span>
            <img src={match.club2?.logo_url} alt={match.club2?.name} className="h-12 w-12 object-contain" />
            <span className="font-bold text-lg">{match.club2?.name}</span>
          </div>
          <div className="mt-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Date:</span> {match.date} &nbsp; <span className="font-medium">Time:</span> {match.time}
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Stadium:</span> {match.stadiums?.name} ({match.stadiums?.capacity} seats)
          </div>
          <div className="mt-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Ticket Price:</span> ${match.stadiums?.price?.toFixed(2) || 'N/A'}
          </div>
        </div>
      )}
      
      {error && !matchFromState && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton height="24px" className="mb-4" />
            <Skeleton height="16px" className="mb-4" />
            <Skeleton height="16px" />
          </div>
        ) : match && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Tickets
              </label>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setNumberOfTickets(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={numberOfTickets <= 1}
                >
                  -
                </motion.button>
                <span className="text-lg font-medium text-gray-800 dark:text-white">{numberOfTickets}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setNumberOfTickets(prev => prev + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={false}
                >
                  +
                </motion.button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Price
              </label>
              <div className="text-lg font-bold text-gray-800 dark:text-white">
                ${totalPrice.toFixed(2)}
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows="3"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('notes')}
              ></textarea>
            </div>
            
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Processing...</span>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  'Book Now'
                )}
              </motion.button>
            </div>
          </form>
        )}
      </div>

      {/* Hiển thị lịch sử đặt vé của người dùng trên trang này */}
      {userBookings.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Recent Bookings</h2>
              <div className="space-y-4">
                  {userBookings.slice(0, 5).map(booking => ( // Chỉ hiển thị 5 booking gần nhất
                      <div key={booking.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Booking ID: #{booking.id}</h3>
                              <span className={`px-2 py-1 rounded text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                  {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                              </span>
                          </div>
                           {booking.match && (
                               <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                   <p>{booking.match.club1?.name} vs {booking.match.club2?.name}</p>
                                   <p>{booking.match.date} at {booking.match.time}</p>
                                   <p>Tickets: {booking.number_of_tickets} | Total: ${booking.total_price?.toFixed(2)}</p>
                               </div>
                           )}
                      </div>
                  ))}
              </div>
              {/* Liên kết đến trang lịch sử đầy đủ */}
               {userBookings.length > 5 && (
                   <div className="mt-4 text-center">
                       <button onClick={() => navigate('/booking-history')} className="btn btn-outline-primary btn-sm">
                           View All Bookings
                       </button>
                   </div>
               )}
          </div>
      )}
    </div>
  )
}

export default BookMatch