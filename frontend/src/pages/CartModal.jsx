import React, { useEffect, useState } from "react";

const CartModal = ({ token, onClose, onAdd }) => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [updatingQty, setUpdatingQty] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:8080/carts", {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setCartData(data);
    } catch {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 100) return;
    setUpdatingQty(cartItemId);
    try {
      const response = await fetch(
        `http://localhost:8080/carts/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ Quantity: newQuantity }),
        },
      );

      if (response.ok) {
        fetchCart();
        onAdd();
      }
    } catch {
      setError("Failed to update quantity");
    } finally {
      setUpdatingQty(null);
    }
  };

  const removeItem = async (cartItemId) => {
    setRemovingItem(cartItemId);
    try {
      const response = await fetch(
        `http://localhost:8080/carts/${cartItemId}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        },
      );

      if (response.ok) {
        fetchCart();
        onAdd();
      }
    } catch {
      setError("Failed to remove item");
    } finally {
      setRemovingItem(null);
    }
  };

  const checkout = async () => {
    setProcessing(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/orders", {
        method: "POST",
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Order placed successfully!");
        setTimeout(() => {
          onClose();
          onAdd();
        }, 1500);
      } else {
        setError(data?.error || "Checkout failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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
    const lowerName = name?.toLowerCase() || "";
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) return emoji;
    }
    return "📦";
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">
            <div className="spinner"></div>
            <p className="loading-text">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🛒 Your Cart</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="form-error-banner" style={{ marginBottom: "16px" }}>
              {error}
            </div>
          )}
          {success && (
            <div
              className="form-success-banner"
              style={{ marginBottom: "16px" }}
            >
              {success}
            </div>
          )}

          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3 className="empty-state-title">Your Cart is Empty</h3>
              <p>Add some items to get started</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div className="cart-item" key={item.ID}>
                  <div className="cart-item-image">
                    {getItemEmoji(item.Item?.Name)}
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-name">
                      {item.Item?.Name || `Item #${item.ItemID}`}
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(item.Price)} each
                    </div>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.ID, item.Quantity - 1)}
                      disabled={updatingQty === item.ID || item.Quantity <= 1}
                    >
                      −
                    </button>
                    <span style={{ minWidth: "32px", textAlign: "center" }}>
                      {updatingQty === item.ID ? "..." : item.Quantity}
                    </span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.ID, item.Quantity + 1)}
                      disabled={updatingQty === item.ID || item.Quantity >= 100}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    {formatPrice(item.Price * item.Quantity)}
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.ID)}
                    disabled={removingItem === item.ID}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>
                    Items ({items.reduce((sum, i) => sum + i.Quantity, 0)})
                  </span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span style={{ color: "#10b981" }}>FREE</span>
                </div>
                <div className="cart-summary-row">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Continue Shopping
            </button>
            <button
              className="btn btn-success"
              onClick={checkout}
              disabled={processing}
            >
              {processing ? "Processing..." : "Checkout →"}
            </button>
          </div>
        )}

        {items.length === 0 && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
