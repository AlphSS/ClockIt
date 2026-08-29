import { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { createInquiry } from "../../services/staysApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function InquiryModal({ stay, onClose, onSuccess }) {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    `Hi, I'm interested in the flat "${stay?.title}". Is it still available? I'd like to know more details.`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!stay) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      await createInquiry(stay.id, message, token);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-[slide-up_0.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <MessageSquare size={18} className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Contact Owner</h3>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{stay.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition"
            placeholder="Write your message to the owner..."
          />

          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {loading ? "Sending..." : "Send Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
