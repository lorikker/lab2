"use client";

import { useState } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { Review } from "@/app/lib/shop-data";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Count user's reviews for this product
  const userReviewCount = session?.user?.id
    ? reviews.filter((review) => review.user.id === session.user.id).length
    : 0;

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push(
        "/login?callbackUrl=" + encodeURIComponent(window.location.href),
      );
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit review");
      }

      setSuccess("Review submitted successfully!");
      setRating(0);
      setComment("");

      // Refresh the page to show the new review
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#2A2A2A]">Customer Reviews</h2>

      {/* Average rating */}
      <div className="mt-4 flex items-center">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">
          {reviews.length > 0
            ? `${averageRating.toFixed(1)} out of 5 (${reviews.length} ${
                reviews.length === 1 ? "review" : "reviews"
              })`
            : "No reviews yet"}
        </span>
      </div>

      {/* Review form */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2A2A2A]">
            Write a Review
          </h3>
          {session && userReviewCount > 0 && (
            <span className="text-sm text-gray-500">
              You have written {userReviewCount} review
              {userReviewCount !== 1 ? "s" : ""} for this product
            </span>
          )}
        </div>

        {session ? (
          <form onSubmit={handleSubmitReview} className="mt-4">
            {/* Rating selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Rating *
              </label>
              <div className="mt-1 flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    {star <= rating ? (
                      <StarIcon className="h-6 w-6 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="h-6 w-6 text-gray-400 hover:text-yellow-300" />
                    )}
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Comment (optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
                placeholder="Share your experience with this product..."
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !session || rating === 0}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
                !session || rating === 0
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[#D5FC51] text-[#2A2A2A] hover:bg-[#c5ec41] focus:ring-2 focus:ring-[#D5FC51] focus:ring-offset-2 focus:outline-none"
              }`}
            >
              {!session
                ? "Sign in to Review"
                : isSubmitting
                  ? "Submitting..."
                  : rating === 0
                    ? "Please select a rating"
                    : "Submit Review"}
            </button>

            {/* Error/success messages */}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {success && (
              <p className="mt-2 text-sm text-green-600">{success}</p>
            )}
          </form>
        ) : (
          <div className="mt-4 py-8 text-center">
            <p className="mb-4 text-gray-600">
              You must be logged in to write a review.
            </p>
            <button
              onClick={() => router.push("/auth/signin")}
              className="rounded-md bg-[#D5FC51] px-6 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#c5ec41] focus:ring-2 focus:ring-[#D5FC51] focus:ring-offset-2 focus:outline-none"
            >
              Sign In to Review
            </button>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2A2A2A]">
            All Reviews ({reviews.length})
          </h3>
        </div>

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews.map((review) => {
              const isUserReview = session?.user?.id === review.user.id;
              return (
                <div
                  key={review.id}
                  className={`rounded-lg border p-6 shadow-sm ${
                    isUserReview
                      ? "border-[#D5FC51] bg-[#D5FC51]/5"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-xs text-gray-500">
                              {review.user.name?.charAt(0) || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#2A2A2A]">
                            {review.user.name || "Anonymous"}
                          </p>
                          {isUserReview && (
                            <span className="inline-flex items-center rounded-full bg-[#D5FC51] px-2 py-1 text-xs font-medium text-[#2A2A2A]">
                              Your review
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-4 text-gray-700">{review.comment}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
