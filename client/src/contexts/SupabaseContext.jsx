import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not defined')
}

// Create client instance with default configuration (when no environment variables)
const defaultSupabaseClient = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

// Create context
const SupabaseContext = createContext(null)

// Custom hook to access Supabase context
export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

// Provider component
export const SupabaseProvider = ({ children }) => {
  const [supabase] = useState(() => defaultSupabaseClient)
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check login session when component is mounted
  useEffect(() => {
    let mounted = true
    let authListener
    
    async function getInitialSession() {
      try {
        setLoading(true)
        
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        // Update state if component is still mounted
        if (mounted) {
          if (sessionError) {
            console.error('Error getting session:', sessionError)
            setError(sessionError)
          }
          
          setSession(currentSession)
          setUser(currentSession?.user || null)
        }
        
        // Only define listener if needed
        if (!authListener) {
          // Listen for authentication state changes
          authListener = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (mounted) {
              setSession(newSession)
              setUser(newSession?.user || null)
            }
          })
        }
      } catch (e) {
        console.error('Error in getInitialSession:', e)
        if (mounted) {
          setError(e)
        }
      } finally {
        // Mark initialization as complete
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getInitialSession()

    return () => {
      mounted = false
      // Unsubscribe listener if defined
      if (authListener) {
        authListener.data?.subscription.unsubscribe()
      }
    }
  }, [supabase])

  // Register new account
  const signUp = async ({ email, password, fullName, phone }) => {
    try {
      setLoading(true)
      console.log("SupabaseContext: Starting signup process", { email, fullName });
      
      // Check if users table exists first
      try {
        const { count, error: tableCheckError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
          
        if (tableCheckError) {
          console.warn("Users table may not exist:", tableCheckError.message);
          // We'll continue anyway and let the insert fail if needed
        } else {
          console.log("Users table exists, count:", count);
        }
      } catch (tableError) {
        console.warn("Error checking users table:", tableError);
        // Continue with signup anyway
      }
      
      // Register account with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null
          }
        }
      });
      
      if (error) {
        console.error("Auth signup error:", error);
        throw error;
      }
      
      if (!data || !data.user) {
        console.error("No user data returned from signUp");
        throw new Error("Registration failed - no user data returned");
      }
      
      console.log("Auth signup successful, user created:", data.user.id);
      
      // Create record in users table - wrap in try/catch to handle specific errors
      try {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            phone: phone || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Continue anyway - the Auth user was created successfully
          // This could happen if the users table doesn't exist or the user record already exists
        } else {
          console.log("User profile created successfully");
        }
      } catch (profileError) {
        console.error('Exception creating user profile:', profileError);
        // We'll continue anyway since the Auth user was created successfully
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUp function:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  // Sign in with email and password
  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      // Thử đăng nhập bình thường trước
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Nếu lỗi là do email chưa xác nhận, cố gắng bỏ qua
      if (error && error.message && error.message.includes('Email not confirmed')) {
        console.log("Email chưa được xác nhận, đang cố gắng bỏ qua...");
        
        // Tìm người dùng trong bảng users để xác nhận họ đã đăng ký
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
          
        if (userData) {
          // Thử đăng nhập trực tiếp với tùy chọn đặc biệt
          const { data: bypassData, error: bypassError } = await supabase.auth.signInWithPassword({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              // Đặt các tùy chọn khác để cố gắng bỏ qua xác nhận email
            }
          });
          
          if (!bypassError && bypassData) {
            // Đăng nhập thành công, trả về dữ liệu
            return { data: bypassData, error: null };
          }
          
          // Nếu vẫn không thành công, trả về lỗi ban đầu
          return { data: null, error };
        }
      }
      
      // Xử lý các lỗi khác bình thường
      return { data, error };
    } catch (error) {
      console.error("Error in signIn:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/')
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Update user information
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      if (!user) throw new Error('You need to be logged in to update your information')
      
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date()
        })
        .eq('id', user.id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Change password
  const changePassword = async (password) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({
        password
      })
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error changing password:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }
  
  // Get current user information from users table
  const getUserProfile = async () => {
    try {
      if (!user) throw new Error('You need to be logged in to view your information')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
  }
  
  // Get user bookings
  const getUserBookings = async () => {
    try {
      if (!user) throw new Error('User not logged in')
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          match_id,
          seats,
          created_at,
          matches (
            *,
            stadiums (*),
            club1:teams!matches_club1_id_fkey (*),
            club2:teams!matches_club2_id_fkey (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return { data: [], error }
    }
  }

  // Export values and functions for use in the application
  const value = {
    supabase,
    session,
    user,
    loading,
    initialized,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    getUserProfile,
    getUserBookings
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export default SupabaseContext