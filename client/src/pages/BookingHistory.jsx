import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// import { useSupabase } from '../contexts/SupabaseContext'; // Không dùng Supabase nữa

function BookingHistory() {
  // const { user, supabase } = useSupabase(); // Không dùng Supabase nữa
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tải lịch sử đặt vé từ localStorage
    console.log('Loading booking history from localStorage');
    const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    setBookingHistory(history);
    setIsLoading(false);
    setError(null); // Xóa lỗi nếu có

    // Phần code tương tác Supabase cũ đã bị bỏ qua:
    // const fetchBookingHistory = async () => { ... code fetch từ supabase ... }
    // fetchBookingHistory()

  }, []); // Dependency array rỗng để chỉ chạy một lần khi mount

  return (
    <div className="max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        Booking History
      </motion.h1>

      {isLoading ? (
        <p>Loading history...</p>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">{error}</div>
      ) : bookingHistory.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
          No confirmed bookings found.
        </div>
      ) : (
        <div className="space-y-6">
          {bookingHistory.map((booking) => (
            <motion.div
              key={booking.id} // Sử dụng ID giả từ localStorage làm key
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Booking ID: #{booking.id}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                  {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                </span>
              </div>
              
              {booking.match ? (
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                   <div className="flex items-center gap-3">
                    {/* Sử dụng dữ liệu match từ object lưu trong localStorage */}
                    <img src={booking.match.club1?.logo_url} alt={booking.match.club1?.name} className="h-8 w-8 object-contain" />
                    <span className="font-bold">{booking.match.club1?.name}</span>
                    <span className="mx-1 text-gray-500 font-semibold">vs</span>
                    <img src={booking.match.club2?.logo_url} alt={booking.match.club2?.name} className="h-8 w-8 object-contain" />
                    <span className="font-bold">{booking.match.club2?.name}</span>
                  </div>
                  <p><span className="font-medium">Date:</span> {booking.match.date} &nbsp; <span className="font-medium">Time:</span> {booking.match.time}</p>
                  <p><span className="font-medium">Stadium:</span> {booking.match.stadiums?.name}</p>
                  <p><span className="font-medium">Number of Tickets:</span> {booking.number_of_tickets}</p>
                  <p><span className="font-medium">Total Price:</span> ${booking.total_price?.toFixed(2)}</p>
                  {booking.notes && <p><span className="font-medium">Notes:</span> {booking.notes}</p>}
                   {/* Sử dụng thời gian tạo booking giả */}
                   <p><span className="font-medium">Booking Time:</span> {new Date(booking.created_at).toLocaleString()}</p>
                </div>
              ) : (
                 <p className="text-gray-700 dark:text-gray-300">Match information not available.</p>
              )}
             
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory; 