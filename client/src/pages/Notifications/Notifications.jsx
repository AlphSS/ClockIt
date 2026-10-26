import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  CalendarDays,
  CheckCircle2,
  Heart,
  Eye,
  LoaderCircle,
  BellRing,
} from "lucide-react";
import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationApi";
import "./Notifications.css";

const filters = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "roomies", label: "Roomies" },
  { id: "marketplace", label: "Marketplace" },
  { id: "chat", label: "Chat" },
  { id: "stays", label: "Stays" },
  { id: "system", label: "System" },
];
const icons = {
  chat: MessageCircle,
  roomies: Heart,
  marketplace: Eye,
  stays: CalendarDays,
  system: CheckCircle2,
};
const relativeTime = (value) => {
  const date = new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (!Number.isFinite(seconds)) return "";
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return "Yesterday";
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};
const sectionName = (value) => {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return "Earlier";
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const result = await getNotifications("all");
      setNotifications(result.notifications || []);
      setUnreadCount(result.unreadCount || 0);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);
  useEffect(() => {
    const timer = window.setInterval(() => loadNotifications(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadNotifications]);

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((n) => {
        if (activeFilter === "unread") return !n.is_read;
        return activeFilter === "all" || n.type === activeFilter;
      }),
    [notifications, activeFilter],
  );
  const groups = useMemo(() => {
    const order = ["Today", "Yesterday", "Earlier"];
    return order
      .map((name) => ({
        name,
        items: filteredNotifications.filter(
          (n) => sectionName(n.created_at) === name,
        ),
      }))
      .filter((group) => group.items.length);
  }, [filteredNotifications]);

  async function handleMarkRead(notification) {
    if (notification.is_read || busyId) {
      if (notification.action_url) navigate(notification.action_url);
      return;
    }
    setBusyId(notification.id);
    setError("");
    try {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
      if (notification.action_url) navigate(notification.action_url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }
  async function handleMarkAllRead() {
    if (!unreadCount || busyId) return;
    setBusyId("all");
    setError("");
    try {
      await markAllNotificationsRead();
      setNotifications((current) =>
        current.map((n) => ({ ...n, is_read: true })),
      );
      setUnreadCount(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="clockit-notifications-page">
      <NavBar />
      <main className="notifications-page">
        <div className="notifications-container">
          <header className="notifications-header">
            <div className="notifications-title">
              <div className="notification-title-icon">
                <Bell size={23} />
              </div>
              <div>
                <span className="notifications-eyebrow">
                  YOUR CLOCKIT ACTIVITY
                </span>
                <h1>Notifications</h1>
                <p>
                  Stay updated with everything happening in your campus
                  community.
                </p>
              </div>
            </div>
            <button
              className="mark-all-btn"
              onClick={handleMarkAllRead}
              disabled={!unreadCount || busyId === "all"}
            >
              {busyId === "all" ? (
                <LoaderCircle size={17} className="spin" />
              ) : (
                <CheckCircle2 size={17} />
              )}{" "}
              Mark all as read
            </button>
          </header>
          {error && (
            <div className="notifications-error" role="alert">
              {error}
              <button onClick={() => setError("")}>Dismiss</button>
            </div>
          )}
          <div className="notification-summary">
            <div className="summary-item">
              <span className="summary-number">{notifications.length}</span>
              <span className="summary-label">Recent notifications</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <span className="summary-number unread-number">
                {unreadCount}
              </span>
              <span className="summary-label">Unread</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-item">
              <span className="summary-number">
                {notifications.length - unreadCount}
              </span>
              <span className="summary-label">Read</span>
            </div>
          </div>
          <div
            className="notification-filters"
            role="tablist"
            aria-label="Filter notifications"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                role="tab"
                aria-selected={activeFilter === filter.id}
                className={activeFilter === filter.id ? "active" : ""}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                {filter.id === "unread" && unreadCount > 0 && (
                  <span className="filter-count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
          <div className="notifications-list">
            {loading ? (
              <div className="notifications-state">
                <LoaderCircle className="spin" size={25} />
                <span>Loading your notifications...</span>
              </div>
            ) : groups.length ? (
              groups.map((group) => (
                <section className="notification-section" key={group.name}>
                  <div className="section-heading">
                    <span>{group.name}</span>
                    <span>{group.items.length}</span>
                  </div>
                  {group.items.map((notification) => {
                    const Icon = icons[notification.type] || BellRing;
                    return (
                      <button
                        key={notification.id}
                        className={`notification-card ${notification.is_read ? "" : "unread"}`}
                        onClick={() => handleMarkRead(notification)}
                        disabled={busyId === notification.id}
                      >
                        <div
                          className={`notification-icon ${notification.type}`}
                        >
                          <Icon size={19} />
                        </div>
                        <div className="notification-content">
                          <div className="notification-main">
                            <h3>{notification.title}</h3>
                            <span className="notification-time">
                              {relativeTime(notification.created_at)}
                            </span>
                          </div>
                          <p>
                            {notification.description ||
                              "There's new activity in your ClockIt account."}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <span
                            className="notification-unread-dot"
                            aria-label="Unread"
                          />
                        )}
                        {notification.action_url && (
                          <span className="notification-open-hint">Open</span>
                        )}
                      </button>
                    );
                  })}
                </section>
              ))
            ) : (
              <div className="empty-notifications">
                <div className="empty-icon">
                  <Bell size={29} />
                </div>
                <h2>
                  {activeFilter === "unread"
                    ? "You're all caught up"
                    : "No notifications here"}
                </h2>
                <p>
                  {activeFilter === "unread"
                    ? "New activity will appear here when you receive it."
                    : "When something happens in your ClockIt community, you'll see it here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
