import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import FadeIn from '../components/animations/FadeIn'
import Skeleton from '../components/Skeleton'

function Profile() {
  const { user, supabase } = useSupabase()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, this would fetch from Supabase
        // For now, we'll use mock data
        
        // Mock user profile data
        setValue('fullName', 'John Doe')
        setValue('email', user?.email || '')
        setValue('phone', '123-456-7890')
        
        // Mock bookings data
        const mockBookings = [
          {
            id: 1,
            match: 'Manchester United vs Liverpool',
            stadium: 'Old Trafford',
            date: '2025-01-15',
            time: '20:00',
            status: 'upcoming',
            tickets: 2,
            totalPrice: 100
          },
          {
            id: 2,
            match: 'Arsenal vs Chelsea',
            stadium: 'Emirates Stadium',
            date: '2025-01-20',
            time: '15:00',
            status: 'upcoming',
            tickets: 1,
            totalPrice: 45
          },
          {
            id: 3,
            match: 'Manchester City vs Tottenham',
            stadium: 'Etihad Stadium',
            date: '2024-12-10',
            time: '17:30',
            status: 'past',
            tickets: 3,
            totalPrice: 105
          }
        ]
        
        setBookings(mockBookings)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load profile data. Please try again later.')
        setIsLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user, setValue])

  const onSubmit = async (data) => {
    try {
      setError(null)
      
      // In a real app, this would update the user profile in Supabase
      console.log('Profile update data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUpdateSuccess(true)
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy')
    } catch (error) {
      return dateString
    }
  }

  const filteredBookings = bookings.filter(booking => booking.status === activeTab)

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Please log in to view your profile.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <Skeleton height="150px" className="rounded-full mx-auto mb-4" />
            <Skeleton height="24px" className="mb-4" />
            <Skeleton height="16px" />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
                <p className="text-gray-600 dark:text-gray-300">{user.phone}</p>
              </div>
            </div>
          </motion.div>

          {/* Bookings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">My Bookings</h2>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-full ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Upcoming
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-full ${
                  activeTab === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Past
              </motion.button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{booking.match}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-1">{booking.stadium}</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">£{booking.totalPrice}</p>
                      <p className="text-sm text-gray-500">{booking.tickets} ticket(s)</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredBookings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500"
                >
                  No {activeTab} bookings found
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile