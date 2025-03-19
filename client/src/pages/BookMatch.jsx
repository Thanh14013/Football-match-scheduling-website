import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { motion } from 'framer-motion'
import FadeIn from '../components/animations/FadeIn'
import Skeleton from '../components/Skeleton'

function BookMatch() {
  const { user } = useSupabase()
  const navigate = useNavigate()
  const [stadiums, setStadiums] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [numberOfTickets, setNumberOfTickets] = useState(1)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        // Simulate API call
        const mockStadiums = [
          { id: 1, name: 'Old Trafford', team: 'Manchester United', capacity: 74140, price: 50 },
          { id: 2, name: 'Emirates Stadium', team: 'Arsenal', capacity: 60704, price: 45 },
          { id: 3, name: 'Anfield', team: 'Liverpool', capacity: 53394, price: 40 },
          { id: 4, name: 'Etihad Stadium', team: 'Manchester City', capacity: 53400, price: 35 },
          { id: 5, name: 'Stamford Bridge', team: 'Chelsea', capacity: 41837, price: 55 }
        ]
        
        setStadiums(mockStadiums)
        setIsLoading(false)
      } catch (error) {
        setError('Failed to load stadiums')
        setIsLoading(false)
      }
    }

    fetchStadiums()
  }, [])

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setError(null)
      setSuccess(false)

      // In a real app, this would be a call to Supabase to store the booking
      // For now, we'll simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate API call to create booking
      await axios.post('/api/matches', {
        userId: user.id,
        stadium: data.stadium,
        date: data.date,
        time: data.time,
        numberOfTickets: numberOfTickets,
        notes: data.notes
      })
      
      setSuccess(true)
      
      // Reset form or redirect
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } catch (error) {
      console.error('Error booking match:', error)
      setError('Failed to book match. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800 dark:text-white"
      >
        Book a Match
      </motion.h1>
      
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 text-green-600 p-4 rounded-md mb-6 dark:bg-green-900/20 dark:text-green-400"
        >
          Booking successful! You will receive a confirmation email shortly.
        </motion.div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton height="24px" className="mb-4" />
            <Skeleton height="16px" className="mb-4" />
            <Skeleton height="16px" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="stadium" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stadium
              </label>
              <select
                id="stadium"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                {...register('stadium', { required: 'Please select a stadium' })}
              >
                <option value="">Select a stadium</option>
                {stadiums.map(stadium => (
                  <option key={stadium.id} value={stadium.name}>
                    {stadium.name} ({stadium.team}) - £{stadium.price}/ticket
                  </option>
                ))}
              </select>
              {errors.stadium && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stadium.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  min={today}
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <select
                  id="time"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  {...register('time', { required: 'Time is required' })}
                >
                  <option value="">Select time</option>
                  {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time.message}</p>
                )}
              </div>
            </div>
            
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
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                >
                  -
                </motion.button>
                <span className="text-lg font-medium">{numberOfTickets}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setNumberOfTickets(prev => prev + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                >
                  +
                </motion.button>
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows="3"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                {...register('notes')}
              ></textarea>
            </div>
            
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Book Now'}
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default BookMatch