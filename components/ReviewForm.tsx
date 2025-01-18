'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ReviewForm({ gameId }: { gameId: string }) {
  const { data: session, status } = useSession();
  console.log(session);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitReview = async () => {
    if (!reviewText) {
      setError('Review text is required');
      return;
    }

    if (!session) {
      setError('You must be logged in to submit a review');
      return;
    }

    try {
      const res = await fetch(`/api/game_reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, reviewText, userId: session.user.publicUserId }),
      });

      if (!res.ok) throw new Error('Failed to submit review');
      setSuccess(true);
      setReviewText('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading') return <p></p>;

  return (
    <div>
      <textarea
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button onClick={submitReview}>Submit Review</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Review submitted!</p>}
    </div>
  );
}
