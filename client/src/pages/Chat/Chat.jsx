import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Phone,
  Video,
  MessageCircle,
  Plus,
  LoaderCircle,
  X,
  CheckCheck,
} from "lucide-react";
import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import {
  getConversations,
  getMessages,
  searchChatUsers,
  sendChatMessage,
  startConversation,
} from "../../services/chatApi";
import "./Chat.css";

const initials = (user) =>
  (user?.full_name || user?.username || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
const displayName = (user) =>
  user?.full_name || user?.username || "ClockIt user";
const timeLabel = (date) =>
  date
    ? new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(
    new URLSearchParams(location.search).get("conversation") || "",
  );
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [showMobileChats, setShowMobileChats] = useState(
    !new URLSearchParams(location.search).get("conversation"),
  );
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const lastRenderedMessageRef = useRef("");
  const selected = conversations.find((c) => c.id === selectedId) || null;

  const loadConversations = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const result = await getConversations();
        setConversations(result.conversations || []);
        setError("");
        const requested = new URLSearchParams(location.search).get(
          "conversation",
        );
        setSelectedId((current) => {
          if (requested && result.conversations.some((c) => c.id === requested))
            return requested;
          if (current && result.conversations.some((c) => c.id === current))
            return current;
          return result.conversations[0]?.id || "";
        });
      } catch (e) {
        setError(e.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [location.search],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);
  useEffect(() => {
    const timer = window.setInterval(() => loadConversations(true), 10000);
    return () => window.clearInterval(timer);
  }, [loadConversations]);

  const loadMessages = useCallback(
    async (silent = false) => {
      if (!selectedId) {
        setMessages([]);
        return;
      }
      try {
        if (!silent) setMessagesLoading(true);
        const result = await getMessages(selectedId);
        setMessages(result.messages || []);
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        if (!silent) setMessagesLoading(false);
      }
    },
    [selectedId],
  );
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);
  useEffect(() => {
    if (!selectedId) return undefined;
    const timer = window.setInterval(() => loadMessages(true), 4000);
    return () => window.clearInterval(timer);
  }, [selectedId, loadMessages]);
  useEffect(() => {
    const lastId = messages[messages.length - 1]?.id || "";
    if (lastId && lastId !== lastRenderedMessageRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      lastRenderedMessageRef.current = lastId;
    }
  }, [messages]);

  useEffect(() => {
    let active = true;
    const term = search.trim();
    if (term.length < 2) {
      setUserResults([]);
      return undefined;
    }
    const timer = window.setTimeout(async () => {
      try {
        const result = await searchChatUsers(term);
        if (active) setUserResults(result.users || []);
      } catch {
        if (active) setUserResults([]);
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search]);

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (c) =>
          displayName(c.otherUser)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (c.otherUser?.username || "")
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  async function chooseUser(user) {
    try {
      setError("");
      const result = await startConversation(user.id);
      await loadConversations(true);
      setSelectedId(result.conversation.id);
      setSearch("");
      setUserResults([]);
      setShowMobileChats(false);
      navigate(`/chat?conversation=${result.conversation.id}`, {
        replace: true,
      });
    } catch (e) {
      setError(e.message);
    }
  }
  function selectConversation(conversation) {
    setSelectedId(conversation.id);
    setShowMobileChats(false);
    navigate(`/chat?conversation=${conversation.id}`, { replace: true });
  }
  async function handleSend(event) {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || !selectedId || sending) return;
    try {
      setSending(true);
      setError("");
      await sendChatMessage(selectedId, body);
      setDraft("");
      await Promise.all([loadMessages(true), loadConversations(true)]);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="clockit-chat-page">
      <NavBar />
      <main className="chat-page">
        <div className="chat-heading">
          <div>
            <span className="chat-eyebrow">YOUR CAMPUS, CONNECTED</span>
            <h1>Messages</h1>
            <p>Conversations with people in your ClockIt community.</p>
          </div>
          <div className="chat-heading-icon">
            <MessageCircle size={22} />
          </div>
        </div>
        {error && (
          <div className="chat-alert" role="alert">
            {error}
            <button onClick={() => setError("")} aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        )}
        <section className="chat-shell">
          <aside
            className={`chat-sidebar ${showMobileChats ? "mobile-visible" : "mobile-hidden"}`}
          >
            <div className="chat-sidebar-head">
              <div>
                <h2>Conversations</h2>
                <span>
                  {conversations.length}{" "}
                  {conversations.length === 1 ? "chat" : "chats"}
                </span>
              </div>
              <MessageCircle size={20} />
            </div>
            <label className="chat-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search people..."
              />
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                hidden={!search}
              >
                <X size={14} />
              </button>
            </label>
            {userResults.length > 0 && (
              <div className="chat-search-results">
                <p>Start a conversation</p>
                {userResults.map((user) => (
                  <button key={user.id} onClick={() => chooseUser(user)}>
                    <span className="chat-avatar small">{initials(user)}</span>
                    <span>
                      <b>{displayName(user)}</b>
                      <small>@{user.username || "student"}</small>
                    </span>
                    <Plus size={16} />
                  </button>
                ))}
              </div>
            )}
            <div className="chat-conversation-list">
              {loading ? (
                <div className="chat-state">
                  <LoaderCircle className="spin" size={22} />
                  Loading chats...
                </div>
              ) : filteredConversations.length ? (
                filteredConversations.map((c) => (
                  <button
                    key={c.id}
                    className={`chat-conversation ${c.id === selectedId ? "active" : ""}`}
                    onClick={() => selectConversation(c)}
                  >
                    <span className="chat-avatar">{initials(c.otherUser)}</span>
                    <span className="chat-conversation-copy">
                      <span className="chat-conversation-title">
                        <b>{displayName(c.otherUser)}</b>
                        <time>
                          {timeLabel(
                            c.latestMessage?.created_at || c.updated_at,
                          )}
                        </time>
                      </span>
                      <span className="chat-preview">
                        {c.latestMessage
                          ? c.latestMessage.body
                          : "Start a conversation"}
                      </span>
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="chat-unread-count">{c.unreadCount}</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="chat-state">
                  <MessageCircle size={24} />
                  <b>{search ? "No matches found" : "No conversations yet"}</b>
                  <span>
                    {search
                      ? "Try another name or username."
                      : "Search for a student above to start chatting."}
                  </span>
                </div>
              )}
            </div>
          </aside>
          <section
            className={`chat-thread ${showMobileChats ? "mobile-hidden" : "mobile-visible"}`}
          >
            {selected ? (
              <>
                <header className="chat-thread-header">
                  <button
                    className="chat-back"
                    onClick={() => setShowMobileChats(true)}
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={19} />
                  </button>
                  <span className="chat-avatar">
                    {initials(selected.otherUser)}
                  </span>
                  <div className="chat-thread-user">
                    <b>{displayName(selected.otherUser)}</b>
                    <span>@{selected.otherUser?.username || "student"}</span>
                  </div>
                  <div className="chat-thread-actions">
                    <button
                      title="Voice calls are not available yet"
                      aria-label="Voice calls unavailable"
                      disabled
                    >
                      <Phone size={18} />
                    </button>
                    <button
                      title="Video calls are not available yet"
                      aria-label="Video calls unavailable"
                      disabled
                    >
                      <Video size={19} />
                    </button>
                    <button
                      title="More options are not available yet"
                      aria-label="More options unavailable"
                      disabled
                    >
                      <MoreVertical size={19} />
                    </button>
                  </div>
                </header>
                <div className="chat-messages" aria-live="polite">
                  {messagesLoading ? (
                    <div className="chat-state">
                      <LoaderCircle className="spin" size={22} />
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="chat-empty-thread">
                      <span className="chat-avatar large">
                        {initials(selected.otherUser)}
                      </span>
                      <h3>
                        Say hello to{" "}
                        {displayName(selected.otherUser).split(" ")[0]}
                      </h3>
                      <p>This is the beginning of your conversation.</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat-message-row ${msg.sender_id === selected.otherUser?.id ? "received" : "sent"}`}
                      >
                        <div className="chat-bubble">
                          <p>{msg.body}</p>
                          <span>
                            {timeLabel(msg.created_at)}
                            {msg.sender_id !== selected.otherUser?.id && (
                              <CheckCheck
                                size={13}
                                className={msg.read_at ? "message-read" : ""}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
                <form className="chat-composer" onSubmit={handleSend}>
                  <button
                    type="button"
                    aria-label="Attachments not available yet"
                    title="Attachments are not available yet"
                    disabled
                  >
                    <Paperclip size={19} />
                  </button>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Write a message..."
                    rows={1}
                    maxLength={5000}
                    aria-label="Message"
                  />
                  <button
                    type="button"
                    aria-label="Emoji picker not available yet"
                    title="Emoji picker is not available yet"
                    disabled
                  >
                    <Smile size={19} />
                  </button>
                  <button
                    className="chat-send-button"
                    type="submit"
                    disabled={!draft.trim() || sending}
                    aria-label="Send message"
                  >
                    {sending ? (
                      <LoaderCircle className="spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
                <div className="chat-composer-hint">
                  Enter to send · Shift + Enter for a new line
                </div>
              </>
            ) : (
              <div className="chat-no-selection">
                <span className="chat-no-selection-icon">
                  <MessageCircle size={30} />
                </span>
                <h2>Your messages</h2>
                <p>
                  Choose a conversation or search for a student to get started.
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
