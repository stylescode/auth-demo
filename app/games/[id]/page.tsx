import { PrismaClient } from '@prisma/client';
import { fetchGame } from '@/utils/rawg';
import ReviewForm from '@/components/ReviewForm';

const prisma = new PrismaClient();

export default async function GamePage({ params }: { params: { id: string } }) {
  const gameId = params.id;

  // Fetch game from database
  const game = await prisma.game.findUnique({
    where: { id: parseInt(gameId) },
  });

  // If not in database, fetch from RAWG API
  let gameData = game;
  if (!game) {
    const apiData = await fetchGame(gameId);
    gameData = {
      id: apiData.id,
      name: apiData.name,
      release: apiData.released,
      createdAt: new Date(),
    };
  }

  // Fetch reviews for this game
  const reviews = await prisma.review.findMany({
    where: { game_id: parseInt(gameId) }
  });

  return (
    <div>
      <h1>{gameData.name}</h1>
      <p>Release Date: </p>
      <h2>Reviews</h2>
      <div>
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id}>
              <p><strong>anonymous:</strong>: {review.review_text}</p>
              <small>Posted on {new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to add one!</p>
        )}
      </div>

      <ReviewForm gameId={gameId} />
    </div>
  );
}
