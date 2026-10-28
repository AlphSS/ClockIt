import { supabaseAdmin } from "../config/supabase.js";
import { createNotification } from "../utils/notifications.js";

const profileFields = "id, full_name, username";

function messageError(res, error, context) {
  console.error(`${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Unable to complete chat request." });
}

export async function getConversations(req, res) {
  const userId = req.user.id;
  try {
    const { data: conversations, error } = await supabaseAdmin
      .from("chat_conversations")
      .select("id, participant_one, participant_two, created_at, updated_at")
      .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
      .order("updated_at", { ascending: false });
    if (error) return messageError(res, error, "Get conversations error");
    if (!conversations?.length)
      return res.json({ success: true, conversations: [] });

    const otherIds = [
      ...new Set(
        conversations.map((c) =>
          c.participant_one === userId ? c.participant_two : c.participant_one,
        ),
      ),
    ];
    const conversationIds = conversations.map((c) => c.id);
    const [
      { data: profiles, error: profileError },
      { data: messages, error: messagesError },
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select(profileFields).in("id", otherIds),
      supabaseAdmin
        .from("chat_messages")
        .select("id, conversation_id, sender_id, body, created_at, read_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false }),
    ]);
    if (profileError)
      return messageError(res, profileError, "Conversation profiles error");
    if (messagesError)
      return messageError(res, messagesError, "Conversation messages error");

    const profileById = new Map((profiles || []).map((p) => [p.id, p]));
    const latestByConversation = new Map();
    const unreadByConversation = new Map();
    for (const msg of messages || []) {
      if (!latestByConversation.has(msg.conversation_id))
        latestByConversation.set(msg.conversation_id, msg);
      if (msg.sender_id !== userId && !msg.read_at)
        unreadByConversation.set(
          msg.conversation_id,
          (unreadByConversation.get(msg.conversation_id) || 0) + 1,
        );
    }
    const result = conversations.map((c) => {
      const otherId =
        c.participant_one === userId ? c.participant_two : c.participant_one;
      return {
        ...c,
        otherUser: profileById.get(otherId) || {
          id: otherId,
          full_name: "ClockIt user",
          username: "user",
        },
        latestMessage: latestByConversation.get(c.id) || null,
        unreadCount: unreadByConversation.get(c.id) || 0,
      };
    });
    return res.json({ success: true, conversations: result });
  } catch (error) {
    return messageError(res, error, "Get conversations exception");
  }
}

export async function startConversation(req, res) {
  const userId = req.user.id;
  const targetId = String(req.body?.userId || "");
  if (!targetId || targetId === userId)
    return res
      .status(400)
      .json({ success: false, message: "Choose another valid user." });
  try {
    const { data: target, error: targetError } = await supabaseAdmin
      .from("profiles")
      .select(profileFields)
      .eq("id", targetId)
      .maybeSingle();
    if (targetError)
      return messageError(res, targetError, "Find chat user error");
    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const [participantOne, participantTwo] = [userId, targetId].sort();
    const { data: existing, error: findError } = await supabaseAdmin
      .from("chat_conversations")
      .select("id, participant_one, participant_two, created_at, updated_at")
      .eq("participant_one", participantOne)
      .eq("participant_two", participantTwo)
      .maybeSingle();
    if (findError)
      return messageError(res, findError, "Find conversation error");
    if (existing)
      return res.json({
        success: true,
        conversation: { ...existing, otherUser: target },
      });

    const { data: created, error: createError } = await supabaseAdmin
      .from("chat_conversations")
      .insert({
        participant_one: participantOne,
        participant_two: participantTwo,
      })
      .select("id, participant_one, participant_two, created_at, updated_at")
      .single();
    if (createError) {
      // A concurrent request may have created the same pair. Re-read before failing.
      const { data: raced } = await supabaseAdmin
        .from("chat_conversations")
        .select("id, participant_one, participant_two, created_at, updated_at")
        .eq("participant_one", participantOne)
        .eq("participant_two", participantTwo)
        .maybeSingle();
      if (raced)
        return res.json({
          success: true,
          conversation: { ...raced, otherUser: target },
        });
      return messageError(res, createError, "Create conversation error");
    }
    return res
      .status(201)
      .json({ success: true, conversation: { ...created, otherUser: target } });
  } catch (error) {
    return messageError(res, error, "Start conversation exception");
  }
}

export async function getMessages(req, res) {
  const userId = req.user.id;
  const conversationId = req.params.conversationId;
  try {
    const { data: conversation, error: conversationError } = await supabaseAdmin
      .from("chat_conversations")
      .select("id, participant_one, participant_two")
      .eq("id", conversationId)
      .maybeSingle();
    if (conversationError)
      return messageError(res, conversationError, "Verify conversation error");
    if (
      !conversation ||
      ![conversation.participant_one, conversation.participant_two].includes(
        userId,
      )
    )
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found." });

    const { data: messages, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, conversation_id, sender_id, body, created_at, read_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) return messageError(res, error, "Get messages error");
    const { error: readError } = await supabaseAdmin
      .from("chat_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .is("read_at", null);
    if (readError) console.error("Mark messages read error:", readError);
    return res.json({ success: true, messages: messages || [] });
  } catch (error) {
    return messageError(res, error, "Get messages exception");
  }
}

export async function sendMessage(req, res) {
  const userId = req.user.id;
  const conversationId = req.params.conversationId;
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
  if (!body)
    return res
      .status(400)
      .json({ success: false, message: "Message cannot be empty." });
  if (body.length > 5000)
    return res
      .status(400)
      .json({
        success: false,
        message: "Message must be 5,000 characters or fewer.",
      });
  try {
    const { data: conversation, error: conversationError } = await supabaseAdmin
      .from("chat_conversations")
      .select("id, participant_one, participant_two")
      .eq("id", conversationId)
      .maybeSingle();
    if (conversationError)
      return messageError(res, conversationError, "Verify conversation error");
    if (
      !conversation ||
      ![conversation.participant_one, conversation.participant_two].includes(
        userId,
      )
    )
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found." });
    const recipientId =
      conversation.participant_one === userId
        ? conversation.participant_two
        : conversation.participant_one;
    const { data: message, error } = await supabaseAdmin
      .from("chat_messages")
      .insert({ conversation_id: conversationId, sender_id: userId, body })
      .select("id, conversation_id, sender_id, body, created_at, read_at")
      .single();
    if (error) return messageError(res, error, "Send message error");
    const { error: updateError } = await supabaseAdmin
      .from("chat_conversations")
      .update({ updated_at: message.created_at })
      .eq("id", conversationId);
    if (updateError)
      console.error("Update conversation timestamp error:", updateError);

    const { data: sender } = await supabaseAdmin
      .from("profiles")
      .select("full_name, username")
      .eq("id", userId)
      .maybeSingle();
    const notificationResult = await createNotification({
      userId: recipientId,
      type: "chat",
      title: `New message from ${sender?.full_name || sender?.username || "a ClockIt user"}`,
      description: body.length > 140 ? `${body.slice(0, 137)}...` : body,
      entityType: "chat",
      entityId: conversationId,
      actionUrl: `/chat?conversation=${conversationId}`,
    });
    if (notificationResult.error)
      console.error(
        "Create chat notification error:",
        notificationResult.error,
      );
    return res.status(201).json({ success: true, message });
  } catch (error) {
    return messageError(res, error, "Send message exception");
  }
}

export async function searchUsers(req, res) {
  const userId = req.user.id;
  const query = String(req.query.q || "")
    .trim()
    .slice(0, 80);
  if (query.length < 2) return res.json({ success: true, users: [] });
  try {
    const safeQuery = query.replace(/[^a-zA-Z0-9_\s]/g, " ").trim();
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(profileFields)
      .neq("id", userId)
      .or(`full_name.ilike.%${safeQuery}%,username.ilike.%${safeQuery}%`)
      .limit(12);
    if (error) return messageError(res, error, "Search chat users error");
    return res.json({ success: true, users: data || [] });
  } catch (error) {
    return messageError(res, error, "Search users exception");
  }
}
