import React, { useEffect, useState } from "react";

const OrderHistory = ({ token, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://abcdeventures.onrender.com/orders/user", {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setOrders(data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "pending",
      processing: "processing",
      shipped: "shipped",
      completed: "completed",
      cancelled: "cancelled",
    };
    return statusColors[status?.toLowerCase()] || "pending";
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">
            <div className="spinner"></div>
            <p className="loading-text">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">📋 Order History</h2>
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

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No Orders Yet</h3>
              <p>Your order history will appear here</p>
            </div>
          ) : (
            <div>
              {orders.map((order) => (
                <div className="order-card" key={order.ID}>
                  <div className="order-header">
                    <div>
                      <span className="order-id">Order #{order.ID}</span>
                      <span
                        style={{
                          marginLeft: "12px",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        {formatDate(order.CreatedAt || new Date())}
                      </span>
                    </div>
                    <span
                      className={`order-status ${getStatusColor(order.Status)}`}
                    >
                      {order.Status || "pending"}
                    </span>
                  </div>
                  <div className="order-body">
                    {order.Cart &&
                    order.Cart.CartItems &&
                    order.Cart.CartItems.length > 0 ? (
                      <>
                        {order.Cart.CartItems.map((item) => (
                          <div className="order-item" key={item.ID}>
                            <div>
                              <span style={{ fontWeight: "500" }}>
                                {item.Item?.Name || `Item #${item.ItemID}`}
                              </span>
                              <span
                                style={{ color: "#64748b", marginLeft: "8px" }}
                              >
                                × {item.Quantity}
                              </span>
                            </div>
                            <span>
                              {formatPrice(item.Price * item.Quantity)}
                            </span>
                          </div>
                        ))}
                        <div className="order-total">
                          <span>Total Paid</span>
                          <span style={{ color: "#10b981" }}>
                            {formatPrice(order.Total)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="order-total">
                        <span>Order Total</span>
                        <span>{formatPrice(order.Total)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
