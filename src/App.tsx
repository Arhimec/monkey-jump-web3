import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { GamePage } from './pages/GamePage';
import { LeaderboardPage } from './pages/LeaderboardPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
