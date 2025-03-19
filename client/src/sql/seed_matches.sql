-- Trận đã đấu (20 trận)
INSERT INTO public.matches (stadium_id, date, time, status, opponent) VALUES
-- Premier League
((SELECT id FROM stadiums WHERE name = 'Old Trafford'), '2024-03-10', '19:45', 'completed', 'Liverpool'),
((SELECT id FROM stadiums WHERE name = 'Emirates Stadium'), '2024-03-09', '17:30', 'completed', 'Manchester City'),
((SELECT id FROM stadiums WHERE name = 'Stamford Bridge'), '2024-03-08', '20:00', 'completed', 'Arsenal'),
((SELECT id FROM stadiums WHERE name = 'Anfield'), '2024-03-07', '15:00', 'completed', 'Chelsea'),
-- La Liga
((SELECT id FROM stadiums WHERE name = 'Santiago Bernabeu'), '2024-03-10', '20:00', 'completed', 'Barcelona'),
((SELECT id FROM stadiums WHERE name = 'Camp Nou'), '2024-03-09', '18:30', 'completed', 'Real Madrid'),
-- Bundesliga
((SELECT id FROM stadiums WHERE name = 'Allianz Arena'), '2024-03-09', '15:30', 'completed', 'Borussia Dortmund'),
((SELECT id FROM stadiums WHERE name = 'Signal Iduna Park'), '2024-03-08', '19:30', 'completed', 'Bayern Munich'),
-- Serie A
((SELECT id FROM stadiums WHERE name = 'San Siro'), '2024-03-10', '20:45', 'completed', 'Inter Milan'),
-- Ligue 1
((SELECT id FROM stadiums WHERE name = 'Parc des Princes'), '2024-03-09', '21:00', 'completed', 'Lyon'),
-- More matches
((SELECT id FROM stadiums WHERE name = 'Old Trafford'), '2024-03-03', '15:00', 'completed', 'Arsenal'),
((SELECT id FROM stadiums WHERE name = 'Emirates Stadium'), '2024-03-02', '17:30', 'completed', 'Tottenham'),
((SELECT id FROM stadiums WHERE name = 'Stamford Bridge'), '2024-03-01', '20:00', 'completed', 'Manchester United'),
((SELECT id FROM stadiums WHERE name = 'Anfield'), '2024-02-29', '19:45', 'completed', 'Manchester City'),
((SELECT id FROM stadiums WHERE name = 'Santiago Bernabeu'), '2024-03-02', '21:00', 'completed', 'Atletico Madrid'),
((SELECT id FROM stadiums WHERE name = 'Camp Nou'), '2024-03-01', '20:00', 'completed', 'Sevilla'),
((SELECT id FROM stadiums WHERE name = 'Allianz Arena'), '2024-03-02', '15:30', 'completed', 'RB Leipzig'),
((SELECT id FROM stadiums WHERE name = 'Signal Iduna Park'), '2024-03-01', '19:30', 'completed', 'Bayer Leverkusen'),
((SELECT id FROM stadiums WHERE name = 'San Siro'), '2024-03-03', '20:45', 'completed', 'Juventus'),
((SELECT id FROM stadiums WHERE name = 'Parc des Princes'), '2024-03-02', '21:00', 'completed', 'Marseille');

-- Trận đang đấu (5 trận)
INSERT INTO public.matches (stadium_id, date, time, status, opponent) VALUES
((SELECT id FROM stadiums WHERE name = 'Old Trafford'), CURRENT_DATE, '15:00', 'live', 'Manchester City'),
((SELECT id FROM stadiums WHERE name = 'Santiago Bernabeu'), CURRENT_DATE, '20:00', 'live', 'Atletico Madrid'),
((SELECT id FROM stadiums WHERE name = 'Allianz Arena'), CURRENT_DATE, '15:30', 'live', 'RB Leipzig'),
((SELECT id FROM stadiums WHERE name = 'San Siro'), CURRENT_DATE, '20:45', 'live', 'Napoli'),
((SELECT id FROM stadiums WHERE name = 'Parc des Princes'), CURRENT_DATE, '21:00', 'live', 'Monaco');

-- Trận sắp diễn ra (20 trận)
INSERT INTO public.matches (stadium_id, date, time, status, opponent) VALUES
-- Premier League
((SELECT id FROM stadiums WHERE name = 'Old Trafford'), '2024-03-24', '16:00', 'upcoming', 'Chelsea'),
((SELECT id FROM stadiums WHERE name = 'Emirates Stadium'), '2024-03-25', '20:00', 'upcoming', 'Liverpool'),
((SELECT id FROM stadiums WHERE name = 'Stamford Bridge'), '2024-03-26', '19:45', 'upcoming', 'Manchester City'),
((SELECT id FROM stadiums WHERE name = 'Anfield'), '2024-03-27', '20:00', 'upcoming', 'Arsenal'),
((SELECT id FROM stadiums WHERE name = 'Tottenham Hotspur Stadium'), '2024-03-28', '19:45', 'upcoming', 'Manchester United'),
-- La Liga
((SELECT id FROM stadiums WHERE name = 'Santiago Bernabeu'), '2024-03-24', '21:00', 'upcoming', 'Valencia'),
((SELECT id FROM stadiums WHERE name = 'Camp Nou'), '2024-03-25', '20:00', 'upcoming', 'Villarreal'),
-- Bundesliga
((SELECT id FROM stadiums WHERE name = 'Allianz Arena'), '2024-03-24', '15:30', 'upcoming', 'Wolfsburg'),
((SELECT id FROM stadiums WHERE name = 'Signal Iduna Park'), '2024-03-25', '19:30', 'upcoming', 'Schalke 04'),
-- Serie A
((SELECT id FROM stadiums WHERE name = 'San Siro'), '2024-03-24', '20:45', 'upcoming', 'Roma'),
-- Ligue 1
((SELECT id FROM stadiums WHERE name = 'Parc des Princes'), '2024-03-24', '21:00', 'upcoming', 'Nice'),
-- More upcoming matches
((SELECT id FROM stadiums WHERE name = 'Old Trafford'), '2024-03-31', '16:00', 'upcoming', 'Newcastle'),
((SELECT id FROM stadiums WHERE name = 'Emirates Stadium'), '2024-04-01', '20:00', 'upcoming', 'West Ham'),
((SELECT id FROM stadiums WHERE name = 'Stamford Bridge'), '2024-04-02', '19:45', 'upcoming', 'Crystal Palace'),
((SELECT id FROM stadiums WHERE name = 'Santiago Bernabeu'), '2024-03-31', '21:00', 'upcoming', 'Real Sociedad'),
((SELECT id FROM stadiums WHERE name = 'Camp Nou'), '2024-04-01', '20:00', 'upcoming', 'Athletic Bilbao'),
((SELECT id FROM stadiums WHERE name = 'Allianz Arena'), '2024-03-31', '15:30', 'upcoming', 'Freiburg'),
((SELECT id FROM stadiums WHERE name = 'Signal Iduna Park'), '2024-04-01', '19:30', 'upcoming', 'Mainz'),
((SELECT id FROM stadiums WHERE name = 'San Siro'), '2024-03-31', '20:45', 'upcoming', 'Lazio'),
((SELECT id FROM stadiums WHERE name = 'Parc des Princes'), '2024-04-01', '21:00', 'upcoming', 'Lille'); 