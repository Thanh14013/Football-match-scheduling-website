import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

function Profile() {
  const { supabase } = useSupabase()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  })

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Kiểm tra phiên hiện tại
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (!session) {
          navigate('/login')
          return
        }
        
        setUser(session.user)
        
        // Lấy thông tin profile từ bảng profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError
        }
        
        if (profileData) {
          setProfile(profileData)
          setFormData({
            full_name: profileData.full_name || '',
            phone: profileData.phone || '',
            avatar_url: profileData.avatar_url || ''
          })
        } else {
          // Nếu chưa có record trong bảng profiles, tạo mới
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: '',
              phone: '',
              avatar_url: ''
            })
          
          if (insertError) throw insertError
          
          // Lấy lại dữ liệu sau khi tạo mới
          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (newProfileError) throw newProfileError
          
          setProfile(newProfile)
          setFormData({
            full_name: newProfile.full_name || '',
            phone: newProfile.phone || '',
            avatar_url: newProfile.avatar_url || ''
          })
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err)
        setError('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserAndProfile()
  }, [supabase, navigate])
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return
      
      try {
        setBookingsLoading(true)
        
        // Lấy danh sách các đặt vé của người dùng
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            number_of_tickets,
            total_price,
            status,
            created_at,
            matches (
              date,
              time,
              club1_id,
              club2_id,
              stadium_id,
              club1:teams!matches_club1_id_fkey (
                name,
                logo_url
              ),
              club2:teams!matches_club2_id_fkey (
                name,
                logo_url
              ),
              stadiums (
                name
              )
            )
          `)
          .eq('user_id', user.id)
        
        if (error) throw error
        
        setBookings(data || [])
      } catch (err) {
        console.error('Lỗi khi lấy danh sách đặt vé:', err)
      } finally {
        setBookingsLoading(false)
      }
    }
    
    fetchBookings()
  }, [supabase, user])
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          avatar_url: formData.avatar_url,
          updated_at: new Date()
        })
        .eq('id', user.id)
      
      if (error) throw error
      
      // Cập nhật state sau khi cập nhật thành công
      setProfile({
        ...profile,
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
        updated_at: new Date()
      })
      
      setEditing(false)
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err)
      setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Profile</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Thông tin cá nhân */}
        <div className="md:col-span-1">
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)} 
                  className="btn btn-sm btn-outline-primary"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      full_name: profile.full_name || '',
                      phone: profile.phone || '',
                      avatar_url: profile.avatar_url || ''
                    })
                  }} 
                  className="btn btn-sm btn-outline-secondary"
                >
                  <FaTimes className="mr-1" /> Cancel
                </button>
              )}
            </div>
            
            {!editing ? (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaUser />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Full Name</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {profile?.full_name || 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaEnvelope />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {user?.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FaPhone />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Phone Number</div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {profile?.phone || 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    className="input bg-gray-100 dark:bg-gray-800"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Avatar (URL)
                  </label>
                  <input
                    type="text"
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="input"
                    disabled={loading}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="mr-2">Đang lưu</span>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
        
        {/* Danh sách đặt vé */}
        <div className="md:col-span-2">
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Booked Tickets</h2>
            
            {bookingsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <FaTicketAlt className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  You have not booked any tickets yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Your booked tickets will appear here
                </p>
                <button 
                  onClick={() => navigate('/matches')}
                  className="btn btn-primary"
                >
                  View Matches
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {bookings.map((booking) => (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-3 md:mb-0">
                          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                            {booking.matches?.club1?.name || 'Home Team'} vs {booking.matches?.club2?.name || 'Away Team'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FaCalendarAlt className="mr-1" />
                              <span>
                                {new Date(booking.matches?.date).toLocaleDateString('vi-VN')} - {booking.matches?.time}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FaMapMarkerAlt className="mr-1" />
                              <span>{booking.matches?.stadiums?.name || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start md:items-end">
                          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium px-3 py-1 rounded-full">
                            Ghế: {booking.number_of_tickets}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Booked on: {new Date(booking.created_at).toLocaleDateString('en-US')}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Booking History */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Booking History</h2>
        
        {bookingsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No bookings found.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {booking.matches?.club1?.name || 'Home Team'} vs {booking.matches?.club2?.name || 'Away Team'}
                  </h3>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  <p><FaCalendarAlt className="inline mr-1" /> Date: {booking.matches?.date || 'N/A'} Time: {booking.matches?.time || 'N/A'}</p>
                  <p><FaMapMarkerAlt className="inline mr-1" /> Stadium: {booking.matches?.stadiums?.name || 'N/A'}</p>
                  <p><FaTicketAlt className="inline mr-1" /> Tickets: {booking.number_of_tickets}</p>
                  <p className="font-semibold">Total Price: ${booking.total_price?.toFixed(2) || '0.00'}</p>
                  <p>Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>
                  {booking.notes && <p>Notes: {booking.notes}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile