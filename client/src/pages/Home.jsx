import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaCalendarAlt, FaFutbol, FaChartLine, FaNewspaper, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import FadeIn from '../components/animations/FadeIn'
import Skeleton from '../components/Skeleton'
import { getMatchesByStatus } from '../lib/supabase'

function Home() {
  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [liveScores, setLiveScores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [featuredMatches, setFeaturedMatches] = useState([])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [newsRef, newsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Team logos mapping
  const teamLogos = {
    'Manchester United': 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
    'Liverpool': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    'Arsenal': 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    'Chelsea': 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    'Barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    'Manchester City': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    'Tottenham': 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  }

  // Fixed news article data
  const newsArticles = [
    {
      id: 1,
      title: 'Manchester United impressive win against Arsenal',
      summary: 'Manchester United secured an impressive 3-0 victory against Arsenal in a match at Old Trafford.',
      imageUrl: 'https://bna.1cdn.vn/2025/01/11/assets.manutd.com-assetpicker-images-0-0-21-59-1391479-_mufc_v_arsenal_04_12_24_pt_88_svptayww1736427819063_large.jpg',
      url: 'https://thethao247.vn/318-manchester-united-arsenal-d250073.html',
      publishedDate: '2024-03-15'
    },
    {
      id: 2,
      title: 'Liverpool wins Champions League after dramatic final',
      summary: 'Liverpool defeated Real Madrid 2-1 in a dramatic Champions League final match.',
      imageUrl: 'https://media.bongda.com.vn/editor-upload/2025-2-27/do_quoc_phi/2.jpg',
      url: 'https://bongda24h.vn/champions-league/',
      publishedDate: '2024-03-12'
    },
    {
      id: 3,
      title: 'Ronaldo scores hat-trick in Al-Nassr victory',
      summary: 'Cristiano Ronaldo scored a hat-trick to help Al-Nassr secure a 5-0 win against Al-Hilal.',
      imageUrl: 'https://photo.znews.vn/w660/Uploaded/mfnuy/2025_03_17/ronaldo.JPG',
      url: 'https://bongda.com.vn/ronaldo-lap-hattrick-giup-al-nassr-thang-dam-d670247.html',
      publishedDate: '2024-03-14'
    },
    {
      id: 4,
      title: 'Barcelona successfully signs young Brazilian star',
      summary: 'Barcelona has officially completed the signing of a young Brazilian striker from Palmeiras.',
      imageUrl: 'https://i.eurosport.com/2024/10/27/4055835-82254348-2560-1440.jpg',
      url: 'https://bongda.com.vn/barca-hoan-tat-thuong-vu-sao-tre-brazil-d673012.html',
      publishedDate: '2024-03-16'
    },
    {
      id: 5,
      title: 'Messi wins 8th Ballon d\'Or in his career',
      summary: 'Lionel Messi has won the Ballon d\'Or for the 8th time in his career, extending his own record.',
      imageUrl: 'https://www.fcbarcelona.com/fcbarcelona/photo/2019/12/02/abbdc187-9e69-4cdb-8636-541d6b3a7b59/mini__R5I4403.JPG',
      url: 'https://www.goal.com/vn/tintuc/messi-qua-bong-vang/bltcffef36c2b3bbae5',
      publishedDate: '2024-03-10'
    },
    {
      id: 6,
      title: 'Vietnam national team prepares for World Cup 2026 qualifiers',
      summary: 'Coach Philippe Troussier has announced a squad of 30 players preparing for the World Cup 2026 qualification matches.',
      imageUrl: 'https://cdnphoto.dantri.com.vn/LfzeHB4f2Gd_c4torE525LPvp_4=/thumb_w/1020/2024/12/30/vn14td29-12-24-1735497260844.jpg?watermark=true',
      url: 'https://vietnamnet.vn/the-thao/bong-da-viet-nam',
      publishedDate: '2024-03-13'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be separate API calls
        const scoresRes = await axios.get('/api/scores')
        setLiveScores(scoresRes.data.filter(match => match.status === 'LIVE').slice(0, 3))
        
        // Mock upcoming matches
        setUpcomingMatches([
          {
            id: 101,
            homeTeam: 'Arsenal',
            awayTeam: 'Manchester United',
            stadium: 'Emirates Stadium',
            date: '2025-01-15',
            time: '15:00'
          },
          {
            id: 102,
            homeTeam: 'Liverpool',
            awayTeam: 'Chelsea',
            stadium: 'Anfield',
            date: '2025-01-16',
            time: '19:45'
          },
          {
            id: 103,
            homeTeam: 'Manchester City',
            awayTeam: 'Tottenham',
            stadium: 'Etihad Stadium',
            date: '2025-01-18',
            time: '17:30'
          }
        ])
        
        // Simulate API call
        setTimeout(() => {
          setFeaturedMatches([
            { id: 1, homeTeam: 'Manchester United', awayTeam: 'Liverpool', time: '20:00' },
            { id: 2, homeTeam: 'Arsenal', awayTeam: 'Chelsea', time: '22:00' },
            { id: 3, homeTeam: 'Barcelona', awayTeam: 'Real Madrid', time: '21:30' }
          ])
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const FeaturedMatches = () => {
    const [featuredMatches, setFeaturedMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    // Dữ liệu mẫu cho Featured Matches
    const SAMPLE_FEATURED_MATCHES = [
      {
        id: 1,
        date: '2024-07-10',
        time: '19:30:00',
        status: 'upcoming',
        stadiums: {
          id: 1,
          name: 'Old Trafford',
          capacity: 74140,
          price: 50.00
        },
        club1: {
          id: 1,
          name: 'Manchester United',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'
        },
        club2: {
          id: 2,
          name: 'Liverpool',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'
        }
      },
      {
        id: 2,
        date: '2024-07-12',
        time: '20:00:00',
        status: 'upcoming',
        stadiums: {
          id: 3,
          name: 'Emirates Stadium',
          capacity: 60704,
          price: 55.00
        },
        club1: {
          id: 3,
          name: 'Arsenal',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'
        },
        club2: {
          id: 4,
          name: 'Chelsea',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
        }
      },
      {
        id: 3,
        date: '2024-07-15',
        time: '21:00:00',
        status: 'upcoming',
        stadiums: {
          id: 5,
          name: 'Camp Nou',
          capacity: 99354,
          price: 65.00
        },
        club1: {
          id: 5,
          name: 'Barcelona',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'
        },
        club2: {
          id: 6,
          name: 'Real Madrid',
          logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'
        }
      }
    ];
  
    useEffect(() => {
      const fetchFeaturedMatches = async () => {
        try {
          // Lấy 3 trận đấu nổi bật (trận đấu sắp tới)
          const matchesData = await getMatchesByStatus('upcoming');
          
          // Nếu không có dữ liệu, sử dụng dữ liệu mẫu
          if (!matchesData || matchesData.length === 0) {
            console.log('Không có dữ liệu trận đấu nổi bật, sử dụng dữ liệu mẫu');
            setFeaturedMatches(SAMPLE_FEATURED_MATCHES);
          } else {
            setFeaturedMatches(matchesData.slice(0, 3));
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching featured matches:', error);
          // Khi có lỗi, sử dụng dữ liệu mẫu
          setFeaturedMatches(SAMPLE_FEATURED_MATCHES);
          setIsLoading(false);
        }
      };
  
      fetchFeaturedMatches();
    }, []);
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Matches</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-pulse">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    y: -5,
                    rotateY: 5,
                    rotateX: -5
                  }}
                  className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 shadow-lg transition-all duration-30 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-14 h-14 bg-blue-600 transform rotate-45 translate-x-6 -translate-y-6"></div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <img 
                            src={match.club1?.logo_url || 'https://via.placeholder.com/40?text=Team'}
                            alt={match.club1?.name} 
                            className="w-10 h-10 mr-2 object-contain"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40?text=Team';
                            }}
                          />
                          <span>{match.club1?.name}</span>
                        </div>
                        <span className="mx-4 text-blue-600 font-bold">VS</span>
                        <div className="flex items-center flex-1 justify-end">
                          <span>{match.club2?.name}</span>
                          <img 
                            src={match.club2?.logo_url || 'https://via.placeholder.com/40?text=Team'}
                            alt={match.club2?.name} 
                            className="w-10 h-10 ml-2 object-contain"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40?text=Team';
                            }}
                          />
                        </div>
                      </div>
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-600" /> 
                    Time: {match.time}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center mt-2">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" /> 
                    Stadium: {match.stadiums?.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 flex items-center mt-2">
                    <FaMoneyBillWave className="mr-2 text-blue-600" /> 
                    Tickets from ${match.stadiums?.price}
                  </p>

                  <Link to={`/book/${match.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Book Tickets
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-black/60 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.2 }}
        /> {/* Overlay for better text visibility */}
        <motion.img 
          src="https://lichvietpro.com/images/dc/wallpaper/football/1387776.jpg" 
          alt="Football Background" 
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          whileHover={{ scale: 1.05 }}
        />
        <motion.div 
          className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto bg-black/30 p-8 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-shadow-lg">Football Match Scheduling</h1>
          <p className="text-xl mb-8 text-shadow">Book your favorite matches and never miss a game</p>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#1E40AF", color: "white" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 17 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Book Now
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Featured Matches Section */}
      <FeaturedMatches />

      {/* Stats Section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.h3 
                className="text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                1000+
              </motion.h3>
              <p className="text-gray-300">Matches Booked</p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.h3 
                className="text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                50+
              </motion.h3>
              <p className="text-gray-300">Stadiums</p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.h3 
                className="text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                100k+
              </motion.h3>
              <p className="text-gray-300">Happy Users</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Football News Section */}
      <motion.div
        ref={newsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={newsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-12"
      >
        <FadeIn>
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center group">
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <FaNewspaper className="mr-3 text-blue-600 text-4xl" />
            </motion.div>
            <span className="relative">
              Latest Football News
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </span>
          </h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5,
                rotateY: 2,
                rotateX: -2
              }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-30 cursor-pointer group"
              onClick={() => window.open(article.url, '_blank')}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Football+News';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">
                    {new Date(article.publishedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.summary}</p>
                <div className="flex justify-end items-center">
                  <motion.a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home