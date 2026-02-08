import React, { useEffect, useState } from "react";

const ItemsList = ({ token, onAdd, onShowCart, onShowOrders }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("https://abcdeventures.onrender.com/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId) => {
    setAddingItem(itemId);
    try {
      const response = await fetch("https://abcdeventures.onrender.com/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ ItemID: itemId, Quantity: 1 }),
      });

      if (response.ok) {
        onAdd();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingItem(null);
    }
  };

  const getItemEmoji = (name) => {
    const emojiMap = {
      laptop: "💻",
      phone: "📱",
      tablet: "📱",
      headphones: "🎧",
      watch: "⌚",
      camera: "📷",
      speaker: "🔊",
      monitor: "🖥️",
      smartwatch: "⌚",
    };
    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) return emoji;
    }
    return "📦";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading items...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="action-bar">
        <button className="btn btn-success" onClick={onShowCart}>
          🛒 View Cart
        </button>
        <button className="btn btn-secondary" onClick={onShowOrders}>
          📋 Order History
        </button>
      </div>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "8px",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        Our Products
      </h2>
      <p
        style={{ textAlign: "center", color: "#64748b", marginBottom: "32px" }}
      >
        Browse our collection of premium products
      </p>

      <div className="items-grid">
        {items.map((item) => (
          <div className="item-card" key={item.ID}>
            <div className="item-image">{getItemEmoji(item.Name)}</div>
            <h3 className="item-name">{item.Name}</h3>
            <p className="item-price">{formatPrice(item.Price)}</p>
            <div className="item-actions">
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => addToCart(item.ID)}
                disabled={addingItem === item.ID}
              >
                {addingItem === item.ID ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">No Items Available</h3>
          <p>Check back later for new products</p>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
