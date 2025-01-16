'use client'

import { useState } from 'react';

export default function GamesPage() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);

  async function searchGames() {
    const response = await fetch(`/api/games?query=${query}`);
    const data = await response.json();
    setGames(data);
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchGames}>Search</button>
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
}