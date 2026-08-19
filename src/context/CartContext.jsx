import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext = createContext();

function variantKey(variant) {
  if (!variant || Object.keys(variant).length === 0) return "";
  return Object.entries(variant)
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product, variant = {}, quantity = 1) {
    const key = variantKey(variant);
    const cartId = `${product.id}__${key}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.cartId === cartId
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentItems,
        {
          cartId,
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          variant,
          quantity,
        },
      ];
    });
  }

  function removeFromCart(cartId) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.cartId !== cartId)
    );
  }

  function increaseQuantity(cartId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(cartId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
