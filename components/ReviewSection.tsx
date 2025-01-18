'use client';

import { useSession } from 'next-auth/react';

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  const { data: session, status } = useSession();

  const handleReviewUpdate = async (id: number, reviewText: string) => {
    const updatedReview = prompt('Update your review:', reviewText);
    if (!updatedReview) return;

    const res = await fetch(`/api/game_reviews`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reviewText: updatedReview }),
    });

    if (!res.ok) {
      console.error('Failed to update review');
      return;
    } else {
      window.location.reload();
    }

  };

  const handleReviewDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    const res = await fetch(`/api/game_reviews`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      console.error('Failed to delete review');
      return;
    } else {
      window.location.reload();
    }
  }

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div>
    {reviews.length ? (
      reviews.map((review) => (
        <div key={review.id} className="border border-black-300 p-4 my-4">
          <p><strong>anonymous:</strong>: {review.review_text}</p>
          <small>Posted on {new Date(review.createdAt).toLocaleDateString()}</small>
          {session.user.publicUserId === review.user_id && (
            <button onClick={() => handleReviewUpdate(review.id, review.review_text)}>Update</button>
          )}
          {(session.user.publicUserId === review.user_id || session.user.role === 'admin') && (
            <button onClick={() => handleReviewDelete(review.id)}>Delete</button>
          )}
        </div>
      ))
    ) : (
      <p>No reviews yet. Be the first to add one!</p>
    )}
  </div>
  );
}