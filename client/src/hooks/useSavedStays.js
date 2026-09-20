import { useState, useCallback, useEffect } from "react";
import { saveStay, unsaveStay, fetchSavedStays } from "../services/staysApi";
import { useAuth } from "../context/AuthContext";

export function useSavedStays(initialSaved = []) {
  const { getToken, user } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set(initialSaved));
  const [loading, setLoading] = useState(null); // holds stayId being toggled

  // Auto-fetch saved stay IDs when user is logged in
  useEffect(() => {
    if (!user) return;
    async function fetchInitial() {
      try {
        const token = await getToken();
        const res = await fetchSavedStays(token);
        const ids = (res.data || []).map((s) => s.id);
        setSavedIds(new Set(ids));
      } catch {
        // silent — not critical
      }
    }
    fetchInitial();
  }, [user, getToken]);

  const isSaved = useCallback((stayId) => savedIds.has(stayId), [savedIds]);

  const toggle = useCallback(async (stayId) => {
    if (!user) return false; // not authenticated

    setLoading(stayId);
    const wasSaved = savedIds.has(stayId);

    // Optimistic update
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(stayId);
      else next.add(stayId);
      return next;
    });

    try {
      const token = await getToken();
      if (wasSaved) {
        await unsaveStay(stayId, token);
      } else {
        await saveStay(stayId, token);
      }
    } catch (err) {
      // Revert on error
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.add(stayId);
        else next.delete(stayId);
        return next;
      });
      console.error("Toggle save error:", err);
    } finally {
      setLoading(null);
    }

    return true;
  }, [savedIds, getToken, user]);

  const initSaved = useCallback((ids) => {
    setSavedIds(new Set(ids));
  }, []);

  return { isSaved, toggle, loading, initSaved };
}
