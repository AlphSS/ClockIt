import { useState } from "react";
import {
  Bell,
  MessageCircle,
  Home,
  ShoppingBag,
  Users,
  CalendarDays,
  CheckCircle2,
  Heart,
  Eye,
  Settings,
  MoreVertical,
} from "lucide-react";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import "./Notifications.css";


const initialNotifications = [
  {
    id: 1,
    type: "roomies",
    icon: Heart,
    title: "Sarah liked your Roomie profile",
    description: "You have a new potential roommate match.",
    time: "10:42 AM",
    section: "Today",
    unread: true,
  },

  {
    id: 2,
    type: "chat",
    icon: MessageCircle,
    title: "New message from Rahul",
    description: "Hey, is the room still available?",
    time: "9:18 AM",
    section: "Today",
    unread: true,
  },

  {
    id: 3,
    type: "marketplace",
    icon: Eye,
    title: "Your marketplace listing was viewed",
    description: "Your study table listing received 8 new views.",
    time: "8:45 AM",
    section: "Today",
    unread: true,
  },

  {
    id: 4,
    type: "stays",
    icon: CalendarDays,
    title: "Stay request received",
    description: "Ananya has requested to book your listed stay.",
    time: "Yesterday",
    section: "Earlier",
    unread: false,
  },

  {
    id: 5,
    type: "roomies",
    icon: Users,
    title: "New roomie match",
    description: "You have a new match based on your preferences.",
    time: "Yesterday",
    section: "Earlier",
    unread: false,
  },

  {
    id: 6,
    type: "marketplace",
    icon: ShoppingBag,
    title: "Your item was saved",
    description: "Someone saved your desk lamp listing.",
    time: "Monday",
    section: "Earlier",
    unread: false,
  },

  {
    id: 7,
    type: "system",
    icon: CheckCircle2,
    title: "Profile updated successfully",
    description: "Your ClockIt profile information has been saved.",
    time: "Monday",
    section: "Earlier",
    unread: false,
  },
];


function Notifications() {

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [activeFilter, setActiveFilter] = useState("all");


  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;


  const markAllAsRead = () => {

    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );

  };


  const markAsRead = (id) => {

    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );

  };


  const filteredNotifications = notifications.filter(
    (notification) => {

      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "unread") {
        return notification.unread;
      }

      return notification.type === activeFilter;

    }
  );


  const todayNotifications = filteredNotifications.filter(
    (notification) => notification.section === "Today"
  );


  const earlierNotifications = filteredNotifications.filter(
    (notification) => notification.section === "Earlier"
  );


  const renderNotification = (notification) => {

    const Icon = notification.icon;

    return (
      <button
        key={notification.id}
        className={`notification-card ${
          notification.unread ? "unread" : ""
        }`}
        onClick={() => markAsRead(notification.id)}
      >

        {/* Notification Icon */}

        <div className={`notification-icon ${notification.type}`}>

          <Icon size={19} />

        </div>


        {/* Content */}

        <div className="notification-content">

          <div className="notification-main">

            <h3>
              {notification.title}
            </h3>

            <span className="notification-time">
              {notification.time}
            </span>

          </div>


          <p>
            {notification.description}
          </p>

        </div>


        {/* Unread indicator */}

        {notification.unread && (
          <span className="notification-unread-dot"></span>
        )}

      </button>
    );
  };


  return (

    <div className="notifications-page-wrapper">

      {/* ================= NAVBAR ================= */}

      <NavBar />


      {/* ================= NOTIFICATIONS ================= */}

      <main className="notifications-page">

        <div className="notifications-container">


          {/* ================= HEADER ================= */}

          <div className="notifications-header">

            <div>

              <div className="notifications-title">

                <div className="notification-title-icon">

                  <Bell size={23} />

                </div>

                <div>

                  <h1>Notifications</h1>

                  <p>
                    Stay updated with everything happening on ClockIt.
                  </p>

                </div>

              </div>

            </div>


            <button
              className="mark-all-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >

              <CheckCircle2 size={17} />

              Mark all as read

            </button>

          </div>


          {/* ================= SUMMARY ================= */}

          <div className="notification-summary">

            <div className="summary-item">

              <span className="summary-number">
                {notifications.length}
              </span>

              <span className="summary-label">
                Total
              </span>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-item">

              <span className="summary-number unread-number">
                {unreadCount}
              </span>

              <span className="summary-label">
                Unread
              </span>

            </div>

          </div>


          {/* ================= FILTERS ================= */}

          <div className="notification-filters">

            <button
              className={
                activeFilter === "all"
                  ? "active"
                  : ""
              }
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>


            <button
              className={
                activeFilter === "unread"
                  ? "active"
                  : ""
              }
              onClick={() => setActiveFilter("unread")}
            >
              Unread

              {unreadCount > 0 && (
                <span className="filter-count">
                  {unreadCount}
                </span>
              )}

            </button>


            <button
              className={
                activeFilter === "roomies"
                  ? "active"
                  : ""
              }
              onClick={() => setActiveFilter("roomies")}
            >
              Roomies
            </button>


            <button
              className={
                activeFilter === "marketplace"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("marketplace")
              }
            >
              Marketplace
            </button>


            <button
              className={
                activeFilter === "chat"
                  ? "active"
                  : ""
              }
              onClick={() => setActiveFilter("chat")}
            >
              Chat
            </button>


            <button
              className={
                activeFilter === "stays"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveFilter("stays")
              }
            >
              Stays
            </button>

          </div>


          {/* ================= NOTIFICATION LIST ================= */}

          <div className="notifications-list">


            {/* TODAY */}

            {todayNotifications.length > 0 && (

              <section className="notification-section">

                <div className="section-heading">

                  <span>Today</span>

                </div>

                {todayNotifications.map(renderNotification)}

              </section>

            )}


            {/* EARLIER */}

            {earlierNotifications.length > 0 && (

              <section className="notification-section">

                <div className="section-heading">

                  <span>Earlier</span>

                </div>

                {earlierNotifications.map(renderNotification)}

              </section>

            )}


            {/* EMPTY STATE */}

            {filteredNotifications.length === 0 && (

              <div className="empty-notifications">

                <div className="empty-icon">

                  <Bell size={30} />

                </div>

                <h2>No notifications here</h2>

                <p>
                  You're all caught up. New activity will
                  appear here.
                </p>

              </div>

            )}

          </div>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
}


export default Notifications;