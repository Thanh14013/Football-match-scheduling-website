import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MatchBooking from './pages/MatchBooking';
import MatchSchedule from './pages/MatchSchedule';
import LiveScores from './pages/LiveScores';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/match-schedule" element={<MatchSchedule />} />
                <Route path="/live-scores" element={<LiveScores />} />
                <Route 
                  path="/book-match" 
                  element={
                    <PrivateRoute>
                      <MatchBooking />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;