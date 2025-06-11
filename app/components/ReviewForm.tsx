'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting review:', { productId, rating, comment });
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      const data = await response.json();
      console.log('Review submission response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      router.refresh(); // Refresh the page to show the new review
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                {star <= rating ? (
                  <StarIcon className="h-6 w-6 text-yellow-400" />
                ) : (
                  <StarIconOutline className="h-6 w-6 text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-2 text-sm font-medium">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting || rating === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}