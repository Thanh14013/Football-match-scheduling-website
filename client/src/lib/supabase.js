import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Hàm lấy danh sách trận đấu với thông tin sân vận động
export const getMatches = async () => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      stadiums (
        name,
        team,
        capacity,
        price
      )
    `)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

// Hàm lấy danh sách sân vận động
export const getStadiums = async () => {
  const { data, error } = await supabase
    .from('stadiums')
    .select('*')
  
  if (error) throw error
  return data
}

// Hàm thêm trận đấu mới
export const addMatch = async (matchData) => {
  const { data, error } = await supabase
    .from('matches')
    .insert([matchData])
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm cập nhật trạng thái trận đấu
export const updateMatchStatus = async (matchId, status) => {
  const { data, error } = await supabase
    .from('matches')
    .update({ status })
    .eq('id', matchId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm lấy danh sách trận đấu theo trạng thái
export const getMatchesByStatus = async (status) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      stadiums (
        name,
        team,
        capacity,
        price
      )
    `)
    .eq('status', status)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

// Hàm lấy danh sách trận đấu theo đội bóng
export const getMatchesByTeam = async (team) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      stadiums (
        name,
        team,
        capacity,
        price
      )
    `)
    .eq('home_team', team)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data
}

// Hàm đặt vé
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm lấy danh sách đặt vé của user
export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      matches (
        *,
        stadiums (
          name,
          team
        )
      )
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

// Hàm lấy thông tin profile
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Hàm cập nhật profile
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm đăng nhập
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Hàm đăng ký
export const signUp = async (email, password, profileData) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })
  
  if (authError) throw authError
  
  if (authData.user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        ...profileData
      }])
      .select()
    
    if (profileError) throw profileError
    return profileData[0]
  }
  
  return null
}

// Hàm đăng xuất
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}