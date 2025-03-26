import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

const SupabaseContext = createContext()

export const useSupabase = () => useContext(SupabaseContext)

export function SupabaseProvider({ children }) {
  // Kiểm tra biến môi trường và cung cấp giá trị mặc định nếu không tồn tại
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Thiếu biến môi trường Supabase URL hoặc Anon Key");
  }
  
  const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )
  
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false) 
  const navigate = useNavigate()
  
  useEffect(() => {
    // Kiểm tra phiên đăng nhập hiện tại
    const getSession = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Lỗi khi lấy phiên:', error)
          throw error
        }
        
        if (data && data.session) {
          setSession(data.session)
          setUser(data.session.user)
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra phiên đăng nhập:', error)
      } finally {
        setLoading(false)
        setInitialized(true) // Đánh dấu đã khởi tạo xong
      }
    }
    
    getSession()
    
    // Lắng nghe sự thay đổi về trạng thái đăng nhập
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event)
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setLoading(false)
      }
    )
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase])
  
  // Hàm đăng nhập
  const signIn = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error)
      return { data: null, error }
    }
  }
  
  // Hàm đăng ký
  const signUp = async ({ email, password, fullName, phone }) => {
    try {
      // Đăng ký tài khoản
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone
          }
        }
      })
      
      if (error) throw error
      
      // Tạo record trong bảng users
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            phone
          })
        
        if (profileError) {
          console.error('Lỗi tạo hồ sơ người dùng:', profileError)
          throw profileError
        }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Lỗi đăng ký:', error)
      return { data: null, error }
    }
  }
  
  // Hàm đăng xuất
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      navigate('/')
      return { error: null }
    } catch (error) {
      console.error('Lỗi đăng xuất:', error)
      return { error }
    }
  }
  
  // Hàm cập nhật thông tin người dùng
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để cập nhật thông tin')
      
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
      console.error('Lỗi cập nhật hồ sơ:', error)
      return { error }
    }
  }
  
  // Hàm cập nhật mật khẩu
  const updatePassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error) {
      console.error('Lỗi cập nhật mật khẩu:', error)
      return { error }
    }
  }
  
  // Hàm lấy thông tin người dùng hiện tại từ bảng users
  const getUserProfile = async () => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để xem thông tin')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Lỗi lấy hồ sơ:', error)
      return { data: null, error }
    }
  }
  
  // Hàm lấy danh sách đặt vé của người dùng
  const getUserBookings = async () => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để xem thông tin đặt vé')
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          match_id,
          seats,
          created_at,
          matches (
            club1, 
            club2, 
            match_date, 
            match_time, 
            stadium
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      console.error('Lỗi lấy danh sách đặt vé:', error)
      return { data: null, error }
    }
  }
  
  // Giá trị truyền xuống cho context
  const value = {
    supabase,
    session,
    user,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    getUserProfile,
    getUserBookings
  }
  
  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}