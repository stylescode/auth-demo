const RAWG_API_BASE_URL = 'https://api.rawg.io/api';

export async function fetchGames(query: string) {
  const response = await fetch(
    `${RAWG_API_BASE_URL}/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${query}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
}

export async function fetchGame(id: string) {
  const response = await fetch(
    `${RAWG_API_BASE_URL}/games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch game: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
