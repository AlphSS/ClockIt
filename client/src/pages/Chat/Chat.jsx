import { useState } from "react";
import {
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";

import "./Chat.css";


const conversations = [
  {
    id: 1,
    name: "Sarah Wilson",
    initials: "SW",
    message: "Absolutely! See you tomorrow 😊",
    time: "10:42 AM",
    unread: 0,
    online: true,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    initials: "RM",
    message: "Is the room still available?",
    time: "9:18 AM",
    unread: 2,
    online: false,
  },
  {
    id: 3,
    name: "Ananya Shah",
    initials: "AS",
    message: "Thanks for sharing the details!",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Arjun Kapoor",
    initials: "AK",
    message: "Can we discuss the rent?",
    time: "Yesterday",
    unread: 1,
    online: false,
  },
  {
    id: 5,
    name: "Meera Joshi",
    initials: "MJ",
    message: "I have sent the documents.",
    time: "Monday",
    unread: 0,
    online: false,
  },
];


const initialMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hey! Is the room still available?",
    time: "10:32 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Hey Sarah! Yes, it's still available 😊",
    time: "10:34 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "That's great! I really liked the listing.",
    time: "10:36 AM",
  },
  {
    id: 4,
    sender: "them",
    text: "Can I visit tomorrow?",
    time: "10:37 AM",
  },
  {
    id: 5,
    sender: "me",
    text: "Absolutely! Tomorrow works perfectly.",
    time: "10:40 AM",
  },
  {
    id: 6,
    sender: "me",
    text: "Would 5:30 PM be okay for you?",
    time: "10:42 AM",
  },
];


function Chat() {

  const [selectedChat, setSelectedChat] = useState(conversations[0]);

  const [messages, setMessages] = useState(initialMessages);

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [showMobileChats, setShowMobileChats] = useState(true);


  const filteredConversations = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );


  const sendMessage = () => {

    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "me",
      text: message,
      time: "Now",
    };

    setMessages([...messages, newMessage]);

    setMessage("");
  };


  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      sendMessage();
    }
  };


  return (

    <div className="chat-page-wrapper">

      {/* ================= NAVBAR ================= */}

      <NavBar />


      {/* ================= CHAT ================= */}

      <div className="chat-page">

        {/* ================= CHAT SIDEBAR ================= */}

        <aside
          className={`chat-sidebar ${
            showMobileChats ? "mobile-visible" : ""
          }`}
        >

          <div className="chat-sidebar-header">

            <div>

              <h1>Messages</h1>

              <p>Stay connected</p>

            </div>

            <button className="chat-menu-btn">

              <MoreVertical size={20} />

            </button>

          </div>


          {/* Search */}

          <div className="chat-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          {/* Conversations */}

          <div className="conversation-list">

            {filteredConversations.map((chat) => (

              <button
                key={chat.id}
                className={`conversation ${
                  selectedChat.id === chat.id ? "active" : ""
                }`}
                onClick={() => {

                  setSelectedChat(chat);

                  setShowMobileChats(false);

                }}
              >

                <div className="avatar-wrapper">

                  <div className="chat-avatar">

                    {chat.initials}

                  </div>

                  {chat.online && (
                    <span className="online-dot"></span>
                  )}

                </div>


                <div className="conversation-content">

                  <div className="conversation-top">

                    <h3>{chat.name}</h3>

                    <span>{chat.time}</span>

                  </div>


                  <div className="conversation-bottom">

                    <p>{chat.message}</p>

                    {chat.unread > 0 && (
                      <span className="unread-count">
                        {chat.unread}
                      </span>
                    )}

                  </div>

                </div>

              </button>

            ))}

          </div>

        </aside>


        {/* ================= CHAT WINDOW ================= */}

        <main
          className={`chat-window ${
            !showMobileChats ? "mobile-chat-visible" : ""
          }`}
        >

          {/* Chat Header */}

          <header className="chat-header">

            <div className="chat-person">

              <button
                className="mobile-back-btn"
                onClick={() => setShowMobileChats(true)}
              >
                <ArrowLeft size={21} />
              </button>


              <div className="avatar-wrapper">

                <div className="chat-avatar large">

                  {selectedChat.initials}

                </div>

                {selectedChat.online && (
                  <span className="online-dot"></span>
                )}

              </div>


              <div>

                <h2>{selectedChat.name}</h2>

                <p>

                  {selectedChat.online ? (
                    <>
                      <span className="status-dot"></span>

                      Online
                    </>
                  ) : (
                    "Last seen recently"
                  )}

                </p>

              </div>

            </div>


            <div className="chat-actions">

              <button title="Call">
                <Phone size={19} />
              </button>

              <button title="Video call">
                <Video size={20} />
              </button>

              <button title="More">
                <MoreVertical size={20} />
              </button>

            </div>

          </header>


          {/* ================= MESSAGES ================= */}

          <section className="messages-area">

            <div className="conversation-date">

              <span>Today</span>

            </div>


            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`message-row ${
                  msg.sender === "me"
                    ? "sent"
                    : "received"
                }`}
              >

                <div className="message-bubble">

                  <p>{msg.text}</p>

                  <span className="message-time">

                    {msg.time}

                    {msg.sender === "me" && (
                      <span className="message-status">
                        ✓✓
                      </span>
                    )}

                  </span>

                </div>

              </div>

            ))}

          </section>


          {/* ================= MESSAGE INPUT ================= */}

          <footer className="message-input-area">

            <button
              className="input-icon"
              title="Attach file"
            >
              <Paperclip size={21} />
            </button>


            <div className="message-input">

              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
              />


              <button className="emoji-btn">

                <Smile size={20} />

              </button>

            </div>


            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!message.trim()}
            >

              <Send size={19} />

            </button>

          </footer>

        </main>

      </div>


      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
}


export default Chat;