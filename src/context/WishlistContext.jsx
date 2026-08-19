import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext();

const WISHLIST_KEY = "dummy-store-wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  function isWishlisted(productId) {
    return wishlist.some((item) => item.id === productId);
  }

  function toggleWishlist(product) {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          rating: product.rating,
          category: product.category,
          stock: product.stock,
        },
      ];
    });
  }

  function removeFromWishlist(productId) {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
