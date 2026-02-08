import React, { useState, useEffect, useCallback } from "react";
import ItemsList from "./pages/ItemsList";
import CartModal from "./pages/CartModal";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(() => (token ? "items" : "login"));

  // Fetch cart count and user data when token changes
  useEffect(() => {
    if (!token) return;

    const initUser = () => {
      setUser({
        id: localStorage.getItem("user_id"),
        username: localStorage.getItem("username"),
        admin: localStorage.getItem("admin") === "true",
      });
    };

    const fetchCartCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/carts", {
          headers: { Authorization: token },
        });

        if (response.ok) {
          const data = await response.json();
          const items = data.items || [];
          const totalQty = items.reduce((sum, item) => sum + item.Quantity, 0);
          setCartCount(totalQty);
        }
      } catch {
        console.error("Failed to fetch cart count");
      }
    };

    initUser();
    fetchCartCount();
  }, [token]);

  const handleLogin = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user_id", userData.user_id);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("admin", userData.admin);

    setToken(newToken);
    setUser({
      id: userData.user_id,
      username: userData.username,
      admin: userData.admin,
    });
    setPage("items");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("admin");

    setToken("");
    setUser(null);
    setCartCount(0);
    setPage("login");
  };

  const handleRegisterSuccess = () => {
    setPage("login");
  };

  // Callback to refresh cart count from child components
  const refreshCartCount = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/carts", {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        const totalQty = items.reduce((sum, item) => sum + item.Quantity, 0);
        setCartCount(totalQty);
      }
    } catch {
      console.error("Failed to fetch cart count");
    }
  }, [token]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>🛒 abcdeVentures</h1>
        {token && (
          <div className="header-actions">
            <button
              className="btn btn-secondary btn-icon"
              onClick={() => setShowOrders(true)}
            >
              📋 Orders
            </button>
            <button
              className="btn btn-success btn-icon"
              onClick={() => setShowCart(true)}
            >
              🛒 Cart ({cartCount})
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "12px",
                paddingLeft: "12px",
                borderLeft: "1px solid #e2e8f0",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "14px" }}>
                Hello, {user?.username || "User"}
              </span>
              {user?.admin && <span className="admin-badge">Admin</span>}
            </div>
            <button
              className="btn btn-secondary"
              style={{ marginLeft: "12px" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {page === "login" && (
        <Login onLogin={handleLogin} onRegister={() => setPage("register")} />
      )}

      {page === "register" && <Register onRegister={handleRegisterSuccess} />}

      {page === "items" && (
        <ItemsList
          token={token}
          user={user}
          onAdd={refreshCartCount}
          onShowCart={() => setShowCart(true)}
          onShowOrders={() => setShowOrders(true)}
        />
      )}

      {showCart && (
        <CartModal
          token={token}
          onClose={() => setShowCart(false)}
          onAdd={refreshCartCount}
        />
      )}

      {showOrders && (
        <OrderHistory token={token} onClose={() => setShowOrders(false)} />
      )}
    </div>
  );
}

export default App;
