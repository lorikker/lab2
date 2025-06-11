// Add this debugging to your review submission function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    console.log("Submitting review:", { productId, rating, comment });
    
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
    console.log("Review submission response:", data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit review');
    }
    
    // Success handling
  } catch (error) {
    console.error("Error submitting review:", error);
    setError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};