import { supabaseAdmin } from "../config/supabase.js";

// ─── GET /api/areas ───────────────────────────────────────────────────────────

export async function getAreas(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("areas")
      .select("*, area_reviews(safety_rating, transport_rating, food_rating, water_rating, internet_rating)")
      .order("name");

    if (error) throw error;

    // Calculate aggregate ratings
    const areasWithRatings = data.map((area) => {
      const reviews = area.area_reviews || [];
      const reviewCount = reviews.length;

      if (reviewCount === 0) {
        return {
          ...area,
          overall_rating: 0,
          review_count: 0,
          avg_safety: 0,
          avg_transport: 0,
          avg_food: 0,
          avg_water: 0,
          avg_internet: 0,
          area_reviews: undefined,
        };
      }

      const avg = (key) =>
        +(reviews.reduce((sum, r) => sum + (r[key] || 0), 0) / reviewCount).toFixed(1);

      const overall = +(
        (avg("safety_rating") + avg("transport_rating") + avg("food_rating") +
          avg("water_rating") + avg("internet_rating")) / 5
      ).toFixed(1);

      return {
        ...area,
        overall_rating: overall,
        review_count: reviewCount,
        avg_safety: avg("safety_rating"),
        avg_transport: avg("transport_rating"),
        avg_food: avg("food_rating"),
        avg_water: avg("water_rating"),
        avg_internet: avg("internet_rating"),
        area_reviews: undefined,
      };
    });

    return res.json({ success: true, data: areasWithRatings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/areas/:id/reviews ───────────────────────────────────────────────

export async function getAreaReviews(req, res) {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabaseAdmin
      .from("area_reviews")
      .select("*, profiles:user_id(username, full_name, avatar_url)", { count: "exact" })
      .eq("area_id", id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return res.json({
      success: true,
      data,
      pagination: { page, limit, total: count, hasMore: offset + limit < count },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/areas/:id/reviews ─────────────────────────────────────────────

export async function createAreaReview(req, res) {
  try {
    const { id } = req.params;
    const { safetyRating, transportRating, foodRating, waterRating, internetRating, comment } = req.body;

    // Validate ratings
    const ratings = [safetyRating, transportRating, foodRating, waterRating, internetRating];
    for (const r of ratings) {
      if (!r || r < 1 || r > 5) {
        return res.status(400).json({
          success: false,
          message: "All ratings must be between 1 and 5.",
        });
      }
    }

    // Prevent duplicate review from same user for same area
    const { data: existing } = await supabaseAdmin
      .from("area_reviews")
      .select("id")
      .eq("area_id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (existing) {
      // Update existing review
      const { data, error } = await supabaseAdmin
        .from("area_reviews")
        .update({
          safety_rating: parseInt(safetyRating),
          transport_rating: parseInt(transportRating),
          food_rating: parseInt(foodRating),
          water_rating: parseInt(waterRating),
          internet_rating: parseInt(internetRating),
          comment: comment?.trim() || null,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;

      return res.json({ success: true, message: "Review updated.", data });
    }

    const { data, error } = await supabaseAdmin
      .from("area_reviews")
      .insert({
        area_id: id,
        user_id: req.user.id,
        safety_rating: parseInt(safetyRating),
        transport_rating: parseInt(transportRating),
        food_rating: parseInt(foodRating),
        water_rating: parseInt(waterRating),
        internet_rating: parseInt(internetRating),
        comment: comment?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/areas/:id ───────────────────────────────────────────────────────

export async function getAreaById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("areas")
      .select("*, area_reviews(safety_rating, transport_rating, food_rating, water_rating, internet_rating, comment, created_at, profiles:user_id(username, full_name))")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Area not found." });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
