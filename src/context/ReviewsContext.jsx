import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ReviewsContext = createContext();

const REVIEWS_KEY = "dummy-store-reviews";

export function ReviewsProvider({ children }) {
  // Shape: { [productId]: Review[] }
  const [reviewsByProduct, setReviewsByProduct] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviewsByProduct));
  }, [reviewsByProduct]);

  function addReview(productId, review) {
    const newReview = {
      reviewerName: review.reviewerName || "Pengguna",
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
      date: new Date().toISOString(),
    };

    setReviewsByProduct((prev) => ({
      ...prev,
      [productId]: [newReview, ...(prev[productId] || [])],
    }));
  }

  function getReviews(productId) {
    return reviewsByProduct[productId] || [];
  }

  return (
    <ReviewsContext.Provider value={{ addReview, getReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
