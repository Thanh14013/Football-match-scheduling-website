import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../utils/supabaseClient';

interface Stadium {
  id: number;
  name: string;
  team: string;
  capacity: number;
}

const MatchBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedStadium, setSelectedStadium] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [playerCount, setPlayerCount] = useState<number>(10);
  
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get('/api/stadiums');
        setStadiums(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stadiums:', error);
        toast.error('Failed to load stadiums');
        setLoading(false);
      }
    };
    
    fetchStadiums();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStadium || !selectedDate || !selectedTime || !playerCount) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Combine date and time
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      // In a real app, this would be saved to Supabase
      // For demo purposes, we'll simulate it
      
      // Check for duplicate bookings (would be done in Supabase in real app)
      const isDuplicate = false; // This would be a real check in production
      
      if (isDuplicate) {
        toast.error('This time slot is already booked');
        setSubmitting(false);
        return;
      }
      
      // Create booking
      const stadium = stadiums.find(s => s.id === selectedStadium);
      
      // This would be a Supabase insert in a real app
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .insert([
      //     {
      //       user_id: user.id,
      //       stadium_id: selectedStadium,
      //       date_time: dateTime.toISOString(),
      //       player_count: playerCount
      //     }
      //   ]);
      
      // Send confirmation email (would be handled by a serverless function in production)
      await axios.post('/api/matches', {
        userId: user?.id,
        stadiumId: selectedStadium,
        dateTime: dateTime.toISOString(),
        playerCount
      });
      
      toast.success('Match booked successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book match');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Generate available time slots (9 AM to 9 PM, hourly)
  const timeSlots = [];
  for (let i = 9; i <= 21; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Book a Match
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Select a stadium, date, and time to schedule your football match.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="stadium"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Stadium
                    </label>
                    <select
                      id="stadium"
                      name="stadium"
                      value={selectedStadium || ''}
                      onChange={(e) => setSelectedStadium(parseInt(e.target.value))}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                      disabled={loading}
                    >
                      <option value="">Select a stadium</option>
                      {stadiums.map((stadium) => (
                        <option key={stadium.id} value={stadium.id}>
                          {stadium.name} ({stadium.team})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Date
                    </label>
                    <DatePicker
                      id="date"
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                      placeholderText="Select a date"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="playerCount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Number of Players
                    </label>
                    <input
                      type="number"
                      name="playerCount"
                      id="playerCount"
                      min="2"
                      max="22"
                      value={playerCount}
                      onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? 'Booking...' : 'Book Match'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchBooking;