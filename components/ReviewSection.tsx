'use client';

import { useSession } from 'next-auth/react';

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  const { data: session, status } = useSession();

  const handleReviewUpdate = async (id: number, reviewText: string) => {
    const updatedReview = prompt('Update your review:', reviewText);
    if (!updatedReview) return;

    // update the review
    const res = await fetch(`/api/game_reviews`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reviewText: updatedReview }),
    });

    if (!res.ok) {
      console.error('Failed to update review');
      return;
    } else {
      // refresh the page
      window.location.reload();
    }

  };

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div>
    {reviews.length ? (
      reviews.map((review) => (
        <div key={review.id}>
          <p><strong>anonymous:</strong>: {review.review_text}</p>
          <small>Posted on {new Date(review.createdAt).toLocaleDateString()}</small>
          {session.user.publicUserId === review.user_id && (
            <button onClick={() => handleReviewUpdate(review.id, review.review_text)}>Update</button>
          )}
        </div>
      ))
    ) : (
      <p>No reviews yet. Be the first to add one!</p>
    )}
  </div>
  );
}