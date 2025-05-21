import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from '../components/Skeleton';
// import { useSupabase } from '../contexts/SupabaseContext'; // Không dùng Supabase nữa

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // const { supabase } = useSupabase(); // Không dùng Supabase nữa

  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  // const [bookingId, setBookingId] = useState(null); // Không dùng Supabase ID nữa
  
  useEffect(() => {
    // Lấy dữ liệu booking từ state khi navigate hoặc từ sessionStorage làm fallback
    const bookingDataFromState = location.state?.bookingData;
    const tempBookingData = sessionStorage.getItem('tempBookingData');
    
    if (bookingDataFromState) {
      setBookingDetails(bookingDataFromState);
      setIsLoading(false);
      sessionStorage.removeItem('tempBookingData'); // Xóa dữ liệu tạm sau khi đọc
    } else if (tempBookingData) {
      try {
        const data = JSON.parse(tempBookingData);
        setBookingDetails(data);
        setIsLoading(false);
        sessionStorage.removeItem('tempBookingData'); // Xóa dữ liệu tạm sau khi đọc
      } catch (e) {
        console.error('Failed to parse booking data from sessionStorage:', e);
        setError('Could not load booking information from temporary storage. Please try again.');
        setIsLoading(false);
      }
    } else {
      setError('Booking information not found. Please return to the booking page.');
      setIsLoading(false);
    }

  }, [location.state]); // Phụ thuộc vào state của location

  const handleConfirmPayment = async () => {
    setIsConfirming(true);
    setError(null);

    if (!bookingDetails) {
      setError('No booking information to confirm.');
      setIsConfirming(false);
      return;
    }

    // --- Bắt đầu mô phỏng xác nhận thanh toán ---
    console.log('Simulating payment confirmation for booking:', bookingDetails.id);
    
    // Tạo booking object đã xác nhận
    const confirmedBooking = {
      ...bookingDetails,
      status: 'confirmed', // Cập nhật trạng thái
      confirmed_at: new Date().toISOString() // Thêm thời gian xác nhận giả
    };

    // Lưu thông tin đặt vé vào localStorage (mô phỏng lịch sử)
    const existingBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    const updatedBookings = [confirmedBooking, ...existingBookings];
    localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));

    // Mô phỏng thời gian xử lý
    setTimeout(() => {
      console.log('Simulated payment confirmed. Navigating to history.');
      // Chuyển hướng đến trang lịch sử đặt vé
      navigate('/booking-history');
      setIsConfirming(false);
    }, 2000); // Mô phỏng thời gian xử lý 2 giây

    // --- Kết thúc mô phỏng xác nhận thanh toán ---

    // Phần code tương tác Supabase cũ đã bị bỏ qua:
    // const { data, error } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId).select().single();
    // ... xử lý kết quả Supabase ...
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <Skeleton height="300px" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Error Loading Information</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{error}</p>
        <button onClick={() => navigate('/schedule')} className="btn btn-primary">Back to Schedule</button>
      </div>
    );
  }

  const { match, numberOfTickets, totalPrice, notes } = bookingDetails || {};

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        Payment Page
      </motion.h1>

      {/* Hiển thị thông tin đặt vé từ bookingDetails */}
      {bookingDetails ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Booking Information</h2>
          {bookingDetails.match ? (
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <img src={bookingDetails.match.club1?.logo_url} alt={bookingDetails.match.club1?.name} className="h-8 w-8 object-contain" />
                <span className="font-bold">{bookingDetails.match.club1?.name}</span>
                <span className="mx-1 text-gray-500 font-semibold">vs</span>
                <img src={bookingDetails.match.club2?.logo_url} alt={bookingDetails.match.club2?.name} className="h-8 w-8 object-contain" />
                <span className="font-bold">{bookingDetails.match.club2?.name}</span>
              </div>
              <p><span className="font-medium">Date:</span> {bookingDetails.match.date} &nbsp; <span className="font-medium">Time:</span> {bookingDetails.match.time}</p>
              <p><span className="font-medium">Stadium:</span> {bookingDetails.match.stadiums?.name}</p>
              <p><span className="font-medium">Number of Tickets:</span> {bookingDetails.number_of_tickets}</p>
              <p><span className="font-medium">Total Price:</span> ${bookingDetails.total_price?.toFixed(2)}</p>
              {bookingDetails.notes && <p><span className="font-medium">Notes:</span> {bookingDetails.notes}</p>}
              {/* Sử dụng ID giả cho hiển thị */}
              <p><span className="font-medium">Booking ID:</span> #{bookingDetails.id}</p>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Match information not available.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">Loading booking information...</p>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Pay via QR Code</h2>
        {/* Placeholder for QR Code image */}
        <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 mx-auto flex items-center justify-center text-gray-500 dark:text-gray-400 rounded-md">
          [Placeholder QR Code]
        </div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Scan the QR code to pay</p>
      </div>

      <div className="pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleConfirmPayment}
          disabled={isConfirming || !bookingDetails}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isConfirming ? (
            <>
              <span className="mr-2">Confirming...</span>
              <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
            </>
          ) : (
            'Confirm Payment'
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default PaymentPage; 