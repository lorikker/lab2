// Add this debugging to your useEffect or data fetching function
useEffect(() => {
  const fetchReviews = async () => {
    try {
      console.log("Fetching reviews for product:", productId);
      const response = await fetch(`/api/reviews?productId=${productId}`);
      const data = await response.json();
      console.log("Reviews data received:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
      
      setReviews(data.reviews || []);
      // Other state updates...
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchReviews();
}, [productId]);