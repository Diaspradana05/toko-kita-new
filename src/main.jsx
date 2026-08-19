import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { NotificationsProvider } from "./context/NotificationsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <OrdersProvider>
        <NotificationsProvider>
          <ReviewsProvider>
            <WishlistProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </WishlistProvider>
          </ReviewsProvider>
        </NotificationsProvider>
      </OrdersProvider>
    </AuthProvider>
  </StrictMode>
);
