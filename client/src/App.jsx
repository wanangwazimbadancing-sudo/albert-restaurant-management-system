
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { BottomNav } from "./components/layout/BottomNav";
import { HomePage } from "./components/pages/HomePage";
import { CartPage } from "./components/pages/CartPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { AdminPage } from "./components/pages/AdminPage";
import PageNotFound from "./components/PageNotFound";
import { AuthPage } from "./components/AuthPage";
import { ItemFormModal } from "./components/shared/ItemFormModal";
import PageLoader from "./components/PageLoader";
import { COLORS } from "./constants/colors";
import { Icon } from "./components/Icon";
import img from "./assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "https://albert-quick-dine-server.onrender.com/api";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
});
const normalizeMenuItem = (item) => ({ ...item, id: item.id || item._id });
const normalizeOrder = (order) => ({
  ...order,
  id: order.id || order._id,
  customer: typeof order.customer === "object" ? order.customer.name : order.customer,
  createdAt: order.createdAt ? new Date(order.createdAt).getTime() : Date.now(),
  items: order.items.map((item) => ({ ...item, id: item.id || item.menuItem })),
});

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/" || location.pathname === "/home" ? "home" : (location.pathname.replace("/", "") || "home");
  const setPage = (nextPage) => {
    if (nextPage === "home") navigate("/");
    else navigate(`/${nextPage}`);
  };

  const [cart, setCart] = useState({});
  const [confirmedTotal, setConfirmedTotal] = useState(null);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem("authToken")));
  const [ordersLoading, setOrdersLoading] = useState(() => Boolean(localStorage.getItem("authToken")));
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem("authToken"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/menu`)
      .then(({ data }) => setMenu(data.items.map(normalizeMenuItem)))
      .catch((error) => {
        console.error("Unable to load menu:", error);
        setMenu([]);
      })
      .finally(() => setMenuLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setAuthLoading(false);
      setOrdersLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/auth", { replace: true });
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    axios
      .get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setOrders(data.orders.map(normalizeOrder)))
      .catch((error) => {
        console.error("Unable to load orders:", error);
        setOrders([]);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  }, [isAuthenticated]);

  const name = user?.name || "Guest";
  const isAdmin = user?.role === "admin";
  const orderStats = orders.reduce((stats, order) => {
    order.items.forEach((item) => {
      const category = item.category || menu.find((menuItem) => menuItem.id === item.menuItem)?.category;
      if (category) stats[category] = (stats[category] || 0) + item.qty;
    });
    return stats;
  }, {});

  const pushNotification = (audience, title, message) => {
    setNotifications((prev) => [
      {
        id: `nt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        audience,
        title,
        message,
        createdAt: Date.now(),
        read: false,
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllNotificationsRead = (audience) =>
    setNotifications((prev) => prev.map((n) => (n.audience === audience ? { ...n, read: true } : n)));

  const customerNotifications = notifications.filter((n) => n.audience === "customer");
  const adminNotifications = notifications.filter((n) => n.audience === "admin");

  const handleAdd = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const handleCheckout = async (items) => {
    const { data } = await axios.post(
      `${API_URL}/orders`,
      { items: items.map((item) => ({ menuItem: item.id, qty: item.qty })) },
      authHeaders(),
    );
    const order = normalizeOrder(data.order);
    setOrders((prev) => [order, ...prev]);
    setConfirmedTotal(order.total);
    setCart({});
    pushNotification("customer", "Order placed", `Your order ${order.id} has been received and is pending.`);
    pushNotification("admin", "New order received", `${name} placed order ${order.id} for MK ${order.total.toLocaleString()}.`);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    const { data } = await axios.patch(`${API_URL}/orders/${orderId}/status`, { status }, authHeaders());
    const order = normalizeOrder(data.order);
    setOrders((prev) => prev.map((current) => (current.id === order.id ? order : current)));
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === "cancelled") {
      pushNotification("customer", "Order cancelled", `Your order ${orderId} was cancelled.`);
    } else {
      pushNotification("customer", `Order ${label.toLowerCase()}`, `Your order ${orderId} is now ${label.toLowerCase()}.`);
    }
  };

  const handleSaveMenuItem = async (data) => {
    const response =
      editingMenuItem === "new"
        ? await axios.post(`${API_URL}/menu`, data, authHeaders())
        : await axios.patch(`${API_URL}/menu/${editingMenuItem.id}`, data, authHeaders());
    const item = normalizeMenuItem(response.data.item);
    setMenu((prev) =>
      editingMenuItem === "new" ? [item, ...prev] : prev.map((current) => (current.id === item.id ? item : current)),
    );
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = async (id) => {
    await axios.delete(`${API_URL}/menu/${id}`, authHeaders());
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogin = async (form, mode) => {
    const { data } = await axios.post(
      `${API_URL}/auth/${mode === "login" ? "login" : "register"}`,
      {
        ...(mode === "signup" ? { name: form.name } : {}),
        email: form.email,
        password: form.password,
      },
    );

    setUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", data.token);
    navigate("/");
  };

  const handleForgotPassword = (email) =>
    axios.post(`${API_URL}/auth/forgot-password`, { email: email.trim() });

  const handleResetPassword = (token, password) =>
    axios.post(`${API_URL}/auth/reset-password`, { token, password });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem("authToken");
    } catch {}
    navigate("/auth");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {}
  };

  const requireAuth = (element) => (isAuthenticated ? element : <Navigate to="/auth" replace />);
  const guestOnly = (element) => (!isAuthenticated ? element : <Navigate to="/" replace />);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  if (menuLoading || authLoading || ordersLoading) {
    return <PageLoader />;
  }

  return (
    <div
      className={theme === "dark" ? "theme-dark min-h-screen relative" : "theme-light min-h-screen relative"}
      style={{
        fontFamily: "'Inter', sans-serif",
        background: theme === "dark" ? "#0f172a" : "#ffffff",
        color: theme === "dark" ? "#e2e8f0" : "#111827",
      }}
    >

      <div className="relative z-10 flex max-w-6xl mx-auto">
        <Sidebar page={page} setPage={setPage} cartCount={cartCount} name={name} isAdmin={isAdmin} />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-28 lg:pb-16 max-w-xl lg:max-w-none mx-auto w-full">
          <div className="flex items-center gap-2 mb-5 lg:hidden">
            <img src={img} alt="Logo" className="w-8 h-8" />
            <span className="font-extrabold text-sm text-neutral-900">Urinji Quick Dine</span>
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  name={name}
                  menu={menu}
                  cart={cart}
                  onAdd={handleAdd}
                  notifications={customerNotifications}
                  onMarkAllRead={() => markAllNotificationsRead("customer")}
                  onMarkRead={markNotificationRead}
                />
              }
            />
            <Route
              path="/home"
              element={
                <HomePage
                  name={name}
                  menu={menu}
                  cart={cart}
                  onAdd={handleAdd}
                  notifications={customerNotifications}
                  onMarkAllRead={() => markAllNotificationsRead("customer")}
                  onMarkRead={markNotificationRead}
                />
              }
            />
            <Route
              path="/cart"
              element={requireAuth(<CartPage menu={menu} cart={cart} setCart={setCart} onCheckout={handleCheckout} />)}
            />
            <Route
              path="/profile"
              element={requireAuth(
                <ProfilePage
                  name={name}
                  onLogout={handleLogout}
                  orderStats={orderStats}
                  notifications={customerNotifications}
                  onMarkAllRead={() => markAllNotificationsRead("customer")}
                  onMarkRead={markNotificationRead}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              )}
            />
            <Route
              path="/auth"
              element={guestOnly(
                <AuthPage
                  onLogin={handleLogin}
                  onForgotPassword={handleForgotPassword}
                  onResetPassword={handleResetPassword}
                />,
              )}
            />
            <Route
              path="/admin"
              element={requireAuth(
                isAdmin ? (
                  <AdminPage
                    orders={orders}
                    onUpdateStatus={handleUpdateOrderStatus}
                    menu={menu}
                    onAddClick={() => setEditingMenuItem("new")}
                    onEditItem={setEditingMenuItem}
                    onDeleteItem={handleDeleteMenuItem}
                    notifications={adminNotifications}
                    onMarkAllRead={() => markAllNotificationsRead("admin")}
                    onMarkRead={markNotificationRead}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              )}
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </div>

      <BottomNav page={page} setPage={setPage} cartCount={cartCount} isAdmin={isAdmin} />

      {editingMenuItem && (
        <ItemFormModal
          initial={editingMenuItem === "new" ? null : editingMenuItem}
          onClose={() => setEditingMenuItem(null)}
          onSave={handleSaveMenuItem}
        />
      )}

      {confirmedTotal !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-neutral-900 bg-opacity-40 px-6">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="w-7 h-7" />
            </div>
            <p className="font-extrabold text-lg text-neutral-900 mb-1">Order confirmed!</p>
            <p className="text-sm text-neutral-500 mb-6">Your order has been received. We'll notify you when it's ready.</p>
            <button
              onClick={() => setConfirmedTotal(null)}
              className="w-full py-3 rounded-full text-white font-semibold"
              style={{ background: COLORS.dark }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;