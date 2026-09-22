import { supabaseAdmin } from "../config/supabase.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildStayFilters(query, params) {
  const {
    search,
    location,
    minPrice,
    maxPrice,
    bhk,
    furnishing,
    propertyType,
    occupancy,
    gender,
    maxDistance,
    bathrooms,
    status,
    amenities,
    sort,
    featured,
  } = params;

  // Status filter (default to 'available' for public browse)
  if (status && status !== "all") {
    query = query.eq("status", status);
  } else if (!status) {
    query = query.eq("status", "available");
  }

  // Keyword search
  if (search && search.trim()) {
    const q = search.trim();
    query = query.or(
      `title.ilike.%${q}%,location_area.ilike.%${q}%,location_address.ilike.%${q}%,description.ilike.%${q}%,location_campus.ilike.%${q}%,location_landmark.ilike.%${q}%`
    );
  }

  if (location && location.trim()) {
    query = query.ilike("location_area", `%${location.trim()}%`);
  }
  if (minPrice) {
    query = query.gte("rent", parseInt(minPrice));
  }
  if (maxPrice) {
    query = query.lte("rent", parseInt(maxPrice));
  }
  if (bhk && bhk !== "any") {
    query = query.eq("bhk", bhk);
  }
  if (furnishing && furnishing !== "all") {
    query = query.eq("furnishing", furnishing);
  }
  if (propertyType && propertyType !== "all") {
    query = query.eq("property_type", propertyType);
  }
  if (occupancy && occupancy !== "any") {
    query = query.eq("occupancy_preference", occupancy);
  }
  if (gender && gender !== "any") {
    query = query.eq("gender_preference", gender);
  }
  if (maxDistance) {
    query = query.lte("distance_from_college", parseFloat(maxDistance));
  }
  if (bathrooms && bathrooms !== "any") {
    query = query.gte("bathrooms", parseInt(bathrooms));
  }
  if (amenities) {
    const amenityList = Array.isArray(amenities)
      ? amenities
      : amenities.split(",").map((s) => s.trim()).filter(Boolean);
    if (amenityList.length > 0) {
      query = query.contains("amenities", amenityList);
    }
  }
  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  // Sorting
  switch (sort) {
    case "price_asc":
      query = query.order("rent", { ascending: true });
      break;
    case "price_desc":
      query = query.order("rent", { ascending: false });
      break;
    case "closest":
      query = query.order("distance_from_college", { ascending: true });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "popular":
      query = query.order("views", { ascending: false });
      break;
    default:
      query = query
        .order("is_verified", { ascending: false })
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false });
  }

  return query;
}

async function recalculateStayRating(stayId) {
  try {
    const { data: reviews } = await supabaseAdmin
      .from("stay_reviews")
      .select("rating")
      .eq("stay_id", stayId);

    if (!reviews || reviews.length === 0) {
      await supabaseAdmin
        .from("stays")
        .update({ rating: 0, review_count: 0 })
        .eq("id", stayId);
      return;
    }

    const count = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = parseFloat((sum / count).toFixed(2));

    await supabaseAdmin
      .from("stays")
      .update({ rating: avg, review_count: count })
      .eq("id", stayId);
  } catch (err) {
    console.error("recalculateStayRating error:", err);
  }
}

// ─── GET /api/stays ───────────────────────────────────────────────────────────

export async function getStays(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("stays")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1);

    query = buildStayFilters(query, req.query);

    const { data, error, count } = await query;

    if (error) {
      console.error("getStays error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/stays/featured ──────────────────────────────────────────────────

export async function getFeaturedStays(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("stays")
      .select("*")
      .eq("status", "available")
      .eq("is_featured", true)
      .order("rating", { ascending: false })
      .limit(6);

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/stays/my/listings ───────────────────────────────────────────────

export async function getMyListings(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("stays")
      .select("*")
      .eq("owner_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/stays/:id ───────────────────────────────────────────────────────

export async function getStayById(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("stays")
      .select("*, profiles:owner_id(id, username, full_name, avatar_url)")
      .eq("id", id)
      .single();

    if (error || !data) {
      // Try fetching without profile join if profile relationship doesn't exist
      const { data: rawStay, error: rawError } = await supabaseAdmin
        .from("stays")
        .select("*")
        .eq("id", id)
        .single();

      if (rawError || !rawStay) {
        return res
          .status(404)
          .json({ success: false, message: "Stay not found." });
      }

      // Increment views
      await supabaseAdmin
        .from("stays")
        .update({ views: (rawStay.views || 0) + 1 })
        .eq("id", id);

      return res.json({ success: true, data: rawStay });
    }

    // Increment views
    await supabaseAdmin
      .from("stays")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id);

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/stays ──────────────────────────────────────────────────────────

export async function createStay(req, res) {
  try {
    const {
      title,
      description,
      propertyType,
      bhk,
      bathrooms,
      areaSqft,
      floor,
      totalFloors,
      rent,
      securityDeposit,
      furnishing,
      locationArea,
      locationAddress,
      locationCity,
      locationPincode,
      locationLandmark,
      locationCampus,
      distanceFromCollege,
      occupancyPreference,
      genderPreference,
      facilities,
      amenities,
      images,
      availableFrom,
    } = req.body;

    if (!title || !bhk || !rent) {
      return res.status(400).json({
        success: false,
        message: "Title, BHK and rent are required.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("stays")
      .insert({
        owner_id: req.user.id,
        title: title.trim(),
        description: description?.trim() || null,
        property_type: propertyType || "flat",
        bhk,
        bathrooms: parseInt(bathrooms) || 1,
        area_sqft: areaSqft ? parseInt(areaSqft) : null,
        floor: floor ? parseInt(floor) : null,
        total_floors: totalFloors ? parseInt(totalFloors) : null,
        rent: parseInt(rent),
        security_deposit: securityDeposit ? parseInt(securityDeposit) : 0,
        furnishing: furnishing || "unfurnished",
        location_area: locationArea?.trim() || null,
        location_address: locationAddress?.trim() || null,
        location_city: locationCity?.trim() || "Pune",
        location_pincode: locationPincode?.trim() || null,
        location_landmark: locationLandmark?.trim() || null,
        location_campus: locationCampus?.trim() || null,
        distance_from_college: distanceFromCollege ? parseFloat(distanceFromCollege) : 0,
        occupancy_preference: occupancyPreference || "any",
        gender_preference: genderPreference || "any",
        facilities: facilities || [],
        amenities: amenities || [],
        images: images || [],
        available_from: availableFrom || null,
        status: "available",
        verification_status: "pending",
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error("createStay error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: "Flat listed successfully.",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── PUT /api/stays/:id ───────────────────────────────────────────────────────

export async function updateStay(req, res) {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from("stays")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Stay not found." });
    }
    if (existing.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden. You can only edit your own listings." });
    }

    const {
      title, description, propertyType, bhk, bathrooms, areaSqft,
      floor, totalFloors, rent, securityDeposit, furnishing,
      locationArea, locationAddress, locationCity, locationPincode,
      locationLandmark, locationCampus, distanceFromCollege,
      occupancyPreference, genderPreference, facilities, amenities,
      images, availableFrom, status,
    } = req.body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (propertyType !== undefined) updates.property_type = propertyType;
    if (bhk !== undefined) updates.bhk = bhk;
    if (bathrooms !== undefined) updates.bathrooms = parseInt(bathrooms) || 1;
    if (areaSqft !== undefined) updates.area_sqft = areaSqft ? parseInt(areaSqft) : null;
    if (floor !== undefined) updates.floor = floor ? parseInt(floor) : null;
    if (totalFloors !== undefined) updates.total_floors = totalFloors ? parseInt(totalFloors) : null;
    if (rent !== undefined) updates.rent = parseInt(rent);
    if (securityDeposit !== undefined) updates.security_deposit = securityDeposit ? parseInt(securityDeposit) : 0;
    if (furnishing !== undefined) updates.furnishing = furnishing;
    if (locationArea !== undefined) updates.location_area = locationArea?.trim() || null;
    if (locationAddress !== undefined) updates.location_address = locationAddress?.trim() || null;
    if (locationCity !== undefined) updates.location_city = locationCity?.trim() || "Pune";
    if (locationPincode !== undefined) updates.location_pincode = locationPincode?.trim() || null;
    if (locationLandmark !== undefined) updates.location_landmark = locationLandmark?.trim() || null;
    if (locationCampus !== undefined) updates.location_campus = locationCampus?.trim() || null;
    if (distanceFromCollege !== undefined) updates.distance_from_college = distanceFromCollege ? parseFloat(distanceFromCollege) : 0;
    if (occupancyPreference !== undefined) updates.occupancy_preference = occupancyPreference;
    if (genderPreference !== undefined) updates.gender_preference = genderPreference;
    if (facilities !== undefined) updates.facilities = facilities;
    if (amenities !== undefined) updates.amenities = amenities;
    if (images !== undefined) updates.images = images;
    if (availableFrom !== undefined) updates.available_from = availableFrom || null;
    if (status !== undefined) updates.status = status;

    const { data, error } = await supabaseAdmin
      .from("stays")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, message: "Listing updated.", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── PATCH /api/stays/:id/status ──────────────────────────────────────────────

export async function updateStayStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["available", "unavailable", "rented"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be 'available', 'unavailable', or 'rented'.",
      });
    }

    const { data: existing } = await supabaseAdmin
      .from("stays")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Stay not found." });
    }
    if (existing.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden. You can only update your own listings." });
    }

    const { data, error } = await supabaseAdmin
      .from("stays")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      message: `Listing status updated to ${status}.`,
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── DELETE /api/stays/:id ────────────────────────────────────────────────────

export async function deleteStay(req, res) {
  try {
    const { id } = req.params;

    const { data: existing } = await supabaseAdmin
      .from("stays")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Stay not found." });
    }
    if (existing.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden. You can only delete your own listings." });
    }

    const { error } = await supabaseAdmin
      .from("stays")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ success: true, message: "Listing deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/stays/:id/save ─────────────────────────────────────────────────

export async function saveStay(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("saved_stays")
      .upsert({ user_id: req.user.id, stay_id: id }, { onConflict: "user_id,stay_id" });

    if (error) throw error;

    return res.json({ success: true, message: "Flat saved to wishlist." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── DELETE /api/stays/:id/save ───────────────────────────────────────────────

export async function unsaveStay(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("saved_stays")
      .delete()
      .eq("user_id", req.user.id)
      .eq("stay_id", id);

    if (error) throw error;

    return res.json({ success: true, message: "Flat removed from wishlist." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/stays/:id/view ─────────────────────────────────────────────────

export async function recordView(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.json({ success: true });

    const { error } = await supabaseAdmin
      .from("recently_viewed")
      .upsert(
        { user_id: userId, stay_id: id, viewed_at: new Date().toISOString() },
        { onConflict: "user_id,stay_id" }
      );

    if (error) throw error;

    const { data: allViewed } = await supabaseAdmin
      .from("recently_viewed")
      .select("id, viewed_at")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false });

    if (allViewed && allViewed.length > 20) {
      const toDelete = allViewed.slice(20).map((r) => r.id);
      await supabaseAdmin
        .from("recently_viewed")
        .delete()
        .in("id", toDelete);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/users/me/saved-stays ────────────────────────────────────────────

export async function getSavedStays(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("saved_stays")
      .select("stay_id, stays(*)")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const stays = data.map((r) => r.stays).filter(Boolean);
    return res.json({ success: true, data: stays });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/users/me/recently-viewed ───────────────────────────────────────

export async function getRecentlyViewed(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("recently_viewed")
      .select("stay_id, viewed_at, stays(*)")
      .eq("user_id", req.user.id)
      .order("viewed_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const stays = data.map((r) => ({ ...r.stays, viewedAt: r.viewed_at })).filter(Boolean);
    return res.json({ success: true, data: stays });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/stays/:id/inquiries ────────────────────────────────────────────

export async function createInquiry(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const { data: stay } = await supabaseAdmin
      .from("stays")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!stay) {
      return res.status(404).json({ success: false, message: "Stay not found." });
    }

    if (stay.owner_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot send an inquiry to your own listing.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("stay_inquiries")
      .insert({
        stay_id: id,
        student_id: req.user.id,
        owner_id: stay.owner_id,
        message: message.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Inquiry sent successfully.",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/users/me/inquiries ─────────────────────────────────────────────

export async function getMyInquiries(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("stay_inquiries")
      .select("*, stays(title, location_area, images, rent)")
      .eq("student_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── REVIEWS CONTROLLERS ─────────────────────────────────────────────────────

export async function getStayReviews(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("stay_reviews")
      .select("*, profiles:reviewer_id(id, full_name, username, avatar_url)")
      .eq("stay_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback query if profiles relation is missing
      const { data: rawReviews, error: rawErr } = await supabaseAdmin
        .from("stay_reviews")
        .select("*")
        .eq("stay_id", id)
        .order("created_at", { ascending: false });
      if (rawErr) throw rawErr;
      return res.json({ success: true, data: rawReviews || [] });
    }

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("getStayReviews error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function createStayReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || parseInt(rating) < 1 || parseInt(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
    }
    if (!review || !review.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text is required.",
      });
    }

    const { data: stay } = await supabaseAdmin
      .from("stays")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!stay) {
      return res.status(404).json({ success: false, message: "Stay not found." });
    }
    if (stay.owner_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot review your own listing.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("stay_reviews")
      .insert({
        stay_id: id,
        reviewer_id: req.user.id,
        rating: parseInt(rating),
        review: review.trim(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this stay.",
        });
      }
      throw error;
    }

    await recalculateStayRating(id);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data,
    });
  } catch (err) {
    console.error("createStayReview error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function updateStayReview(req, res) {
  try {
    const { id, reviewId } = req.params;
    const { rating, review } = req.body;

    const { data: existing } = await supabaseAdmin
      .from("stay_reviews")
      .select("reviewer_id")
      .eq("id", reviewId)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    if (existing.reviewer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    const updates = { updated_at: new Date().toISOString() };
    if (rating) updates.rating = parseInt(rating);
    if (review) updates.review = review.trim();

    const { data, error } = await supabaseAdmin
      .from("stay_reviews")
      .update(updates)
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;

    await recalculateStayRating(id);

    return res.json({ success: true, message: "Review updated.", data });
  } catch (err) {
    console.error("updateStayReview error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

export async function deleteStayReview(req, res) {
  try {
    const { id, reviewId } = req.params;

    const { data: existing } = await supabaseAdmin
      .from("stay_reviews")
      .select("reviewer_id")
      .eq("id", reviewId)
      .single();

    if (!existing) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    if (existing.reviewer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    const { error } = await supabaseAdmin
      .from("stay_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) throw error;

    await recalculateStayRating(id);

    return res.json({ success: true, message: "Review deleted." });
  } catch (err) {
    console.error("deleteStayReview error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/stays/seed ─────────────────────────────────────────────────────

export async function seedStays(req, res) {
  try {
    const { count } = await supabaseAdmin
      .from("stays")
      .select("id", { count: "exact", head: true });

    if (count > 0) {
      return res.json({
        success: true,
        message: `Database already has ${count} stays. Skipping seed.`,
      });
    }

    const areas = [
      { name: "Kothrud", city: "Pune" },
      { name: "Karve Nagar", city: "Pune" },
      { name: "Hinjewadi", city: "Pune" },
      { name: "Baner", city: "Pune" },
      { name: "Wakad", city: "Pune" },
      { name: "Aundh", city: "Pune" },
      { name: "Pashan", city: "Pune" },
    ];

    const { data: insertedAreas } = await supabaseAdmin
      .from("areas")
      .upsert(areas, { onConflict: "name" })
      .select();

    const SEED_OWNER_ID = "00000000-0000-0000-0000-000000000001";

    const seedStays = [
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK Fully Furnished Flat near Campus",
        description: "Spacious 2BHK fully furnished flat in Kothrud. Walking distance to Pune University. Perfect for students and young professionals.",
        property_type: "flat",
        bhk: "2 BHK",
        bathrooms: 2,
        area_sqft: 900,
        floor: 3,
        total_floors: 7,
        rent: 18000,
        security_deposit: 36000,
        furnishing: "furnished",
        location_area: "Kothrud",
        location_address: "Near Karve Statue, Kothrud",
        location_city: "Pune",
        location_pincode: "411038",
        location_landmark: "Near Karve Statue",
        location_campus: "Pune University",
        distance_from_college: 1.2,
        occupancy_preference: "any",
        gender_preference: "any",
        facilities: ["College", "Grocery store", "Pharmacy", "Bus stop", "Restaurant", "ATM"],
        amenities: ["WiFi", "Parking", "Lift", "Water Supply", "Security"],
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        ],
        available_from: "2025-06-15",
        status: "available",
        is_verified: true,
        verification_status: "verified",
        rating: 4.6,
        review_count: 32,
        views: 245,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "1BHK Semi Furnished for MIT Students",
        description: "Cozy 1BHK semi-furnished apartment in Karve Nagar. Well-connected by bus. Basic furniture and kitchen appliances included.",
        property_type: "flat",
        bhk: "1 BHK",
        bathrooms: 1,
        area_sqft: 550,
        floor: 2,
        total_floors: 5,
        rent: 11000,
        security_deposit: 22000,
        furnishing: "semi-furnished",
        location_area: "Karve Nagar",
        location_address: "Karve Nagar, Near Municipal School",
        location_city: "Pune",
        location_pincode: "411052",
        location_landmark: "Near Municipal School",
        location_campus: "MIT College",
        distance_from_college: 0.8,
        occupancy_preference: "students",
        gender_preference: "any",
        facilities: ["College", "Grocery store", "Bus stop", "Cafe", "Gym"],
        amenities: ["WiFi", "Water Supply", "Security"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        ],
        available_from: "2025-06-01",
        status: "available",
        is_verified: true,
        verification_status: "verified",
        rating: 4.3,
        review_count: 18,
        views: 178,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK Unfurnished Flat near Hinjewadi Phase 1",
        description: "Spacious 2BHK unfurnished flat near Hinjewadi IT Park. Ideal for tech students & IT professionals. Close to major tech companies.",
        property_type: "flat",
        bhk: "2 BHK",
        bathrooms: 2,
        area_sqft: 850,
        floor: 4,
        total_floors: 10,
        rent: 15500,
        security_deposit: 31000,
        furnishing: "unfurnished",
        location_area: "Hinjewadi",
        location_address: "Hinjewadi Phase 1, Near Wipro Gate",
        location_city: "Pune",
        location_pincode: "411057",
        location_landmark: "Near Wipro Gate",
        location_campus: "Symbiosis International University",
        distance_from_college: 2.5,
        occupancy_preference: "any",
        gender_preference: "any",
        facilities: ["Grocery store", "Pharmacy", "Bus stop", "Restaurant", "ATM"],
        amenities: ["Parking", "Lift", "Power Backup"],
        images: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
          "https://images.unsplash.com/photo-1560185127-6a27b4f0e5e0?w=800",
        ],
        available_from: "2025-06-10",
        status: "available",
        is_verified: true,
        verification_status: "verified",
        rating: 4.7,
        review_count: 24,
        views: 312,
        is_featured: true,
      },
    ];

    const { data: insertedStays, error: stayError } = await supabaseAdmin
      .from("stays")
      .insert(seedStays)
      .select();

    if (stayError) {
      console.error("Stay seed error:", stayError);
      return res.status(500).json({
        success: false,
        message: "Failed to seed stays: " + stayError.message,
      });
    }

    return res.json({
      success: true,
      message: `Seeded ${insertedStays.length} stays and ${insertedAreas?.length || 0} areas.`,
      data: { staysCount: insertedStays.length },
    });
  } catch (err) {
    console.error("Seed error:", err);
    return res.status(500).json({ success: false, message: "Seed failed: " + err.message });
  }
}

// ─── Image upload (Supabase Storage) ─────────────────────────────────────────

export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const ext = req.file.originalname.split(".").pop();
    const fileName = `${req.user.id}/${Date.now()}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from("stays-images")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      // Fallback: if bucket does not exist or upload fails, return a data URI placeholder or fallback
      throw error;
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("stays-images")
      .getPublicUrl(fileName);

    return res.json({ success: true, url: urlData.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: err.message || "Upload failed." });
  }
}
