import { supabaseAdmin } from "../config/supabase.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildStayFilters(query, params) {
  const {
    location,
    minPrice,
    maxPrice,
    bhk,
    furnishing,
    amenities,
    sort,
    featured,
  } = params;

  if (location) {
    query = query.ilike("location_area", `%${location}%`);
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
  if (amenities) {
    const amenityList = Array.isArray(amenities)
      ? amenities
      : amenities.split(",");
    query = query.contains("amenities", amenityList);
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
      // recommended: verified first, then by rating
      query = query
        .order("is_verified", { ascending: false })
        .order("rating", { ascending: false });
  }

  return query;
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
        total: count,
        totalPages: Math.ceil(count / limit),
        hasMore: offset + limit < count,
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
      .eq("is_featured", true)
      .order("rating", { ascending: false })
      .limit(6);

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── GET /api/stays/my-listings ───────────────────────────────────────────────

export async function getMyListings(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("stays")
      .select("*")
      .eq("owner_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data });
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
      return res
        .status(404)
        .json({ success: false, message: "Stay not found." });
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
        title,
        description,
        property_type: propertyType || "flat",
        bhk,
        bathrooms: parseInt(bathrooms) || 1,
        area_sqft: areaSqft ? parseInt(areaSqft) : null,
        floor: floor ? parseInt(floor) : null,
        total_floors: totalFloors ? parseInt(totalFloors) : null,
        rent: parseInt(rent),
        security_deposit: securityDeposit ? parseInt(securityDeposit) : 0,
        furnishing: furnishing || "unfurnished",
        location_area: locationArea,
        location_address: locationAddress,
        location_city: locationCity || "Pune",
        location_pincode: locationPincode,
        location_landmark: locationLandmark,
        location_campus: locationCampus,
        amenities: amenities || [],
        images: images || [],
        available_from: availableFrom || null,
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
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    const {
      title, description, propertyType, bhk, bathrooms, areaSqft,
      floor, totalFloors, rent, securityDeposit, furnishing,
      locationArea, locationAddress, locationCity, locationPincode,
      locationLandmark, locationCampus, amenities, images, availableFrom,
    } = req.body;

    const { data, error } = await supabaseAdmin
      .from("stays")
      .update({
        title,
        description,
        property_type: propertyType,
        bhk,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        area_sqft: areaSqft ? parseInt(areaSqft) : undefined,
        floor: floor ? parseInt(floor) : undefined,
        total_floors: totalFloors ? parseInt(totalFloors) : undefined,
        rent: rent ? parseInt(rent) : undefined,
        security_deposit: securityDeposit ? parseInt(securityDeposit) : undefined,
        furnishing,
        location_area: locationArea,
        location_address: locationAddress,
        location_city: locationCity,
        location_pincode: locationPincode,
        location_landmark: locationLandmark,
        location_campus: locationCampus,
        amenities,
        images,
        available_from: availableFrom,
        updated_at: new Date().toISOString(),
      })
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
      return res.status(403).json({ success: false, message: "Forbidden." });
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

    return res.json({ success: true, message: "Flat saved." });
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

    return res.json({ success: true, message: "Flat unsaved." });
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

    // Upsert to avoid duplicates; update viewed_at to keep it "recent"
    const { error } = await supabaseAdmin
      .from("recently_viewed")
      .upsert(
        { user_id: userId, stay_id: id, viewed_at: new Date().toISOString() },
        { onConflict: "user_id,stay_id" }
      );

    if (error) throw error;

    // Keep only latest 20
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

    // Get stay owner
    const { data: stay } = await supabaseAdmin
      .from("stays")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!stay) {
      return res.status(404).json({ success: false, message: "Stay not found." });
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

    return res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

// ─── POST /api/stays/seed ─────────────────────────────────────────────────────

export async function seedStays(req, res) {
  try {
    // Check if already seeded
    const { count } = await supabaseAdmin
      .from("stays")
      .select("id", { count: "exact", head: true });

    if (count > 0) {
      return res.json({
        success: true,
        message: `Database already has ${count} stays. Skipping seed.`,
      });
    }

    // Seed areas first
    const areas = [
      { name: "Kothrud", city: "Pune" },
      { name: "Karve Nagar", city: "Pune" },
      { name: "Hinjewadi", city: "Pune" },
      { name: "Baner", city: "Pune" },
      { name: "Wakad", city: "Pune" },
      { name: "Aundh", city: "Pune" },
      { name: "Pashan", city: "Pune" },
    ];

    const { data: insertedAreas, error: areaError } = await supabaseAdmin
      .from("areas")
      .upsert(areas, { onConflict: "name" })
      .select();

    if (areaError) {
      console.error("Area seed error:", areaError);
    }

    // Use a system/seed user id — we'll create stays with null owner for seed
    // In production, stays need a real owner. For seed data we use a placeholder.
    const SEED_OWNER_ID = "00000000-0000-0000-0000-000000000001";

    const seedStays = [
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK Fully Furnished Flat",
        description: "Spacious 2BHK fully furnished flat in the heart of Kothrud. Walking distance to Pune University. Perfect for students and young professionals.",
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
        amenities: ["WiFi", "Parking", "Lift", "Water Supply", "Security"],
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        ],
        available_from: "2025-06-15",
        is_verified: true,
        verification_status: "verified",
        rating: 4.6,
        review_count: 32,
        views: 245,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "1BHK Semi Furnished",
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
        amenities: ["WiFi", "Water Supply", "Security"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        ],
        available_from: "2025-06-01",
        is_verified: true,
        verification_status: "verified",
        rating: 4.3,
        review_count: 18,
        views: 178,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK Unfurnished Flat",
        description: "Spacious 2BHK unfurnished flat near Hinjewadi IT Park. Ideal for IT professionals. Close to major tech companies.",
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
        amenities: ["Parking", "Lift", "Power Backup"],
        images: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
          "https://images.unsplash.com/photo-1560185127-6a27b4f0e5e0?w=800",
        ],
        available_from: "2025-06-10",
        is_verified: true,
        verification_status: "verified",
        rating: 4.7,
        review_count: 24,
        views: 312,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "1RK Student Room",
        description: "Affordable 1RK room perfect for single student. All basic amenities included. Safe locality.",
        property_type: "room",
        bhk: "1 RK",
        bathrooms: 1,
        area_sqft: 280,
        floor: 1,
        total_floors: 3,
        rent: 7500,
        security_deposit: 15000,
        furnishing: "furnished",
        location_area: "Baner",
        location_address: "Baner Road, Near Dmart",
        location_city: "Pune",
        location_pincode: "411045",
        location_landmark: "Near Dmart",
        location_campus: "Symbiosis",
        amenities: ["WiFi", "Water Supply", "Security", "Washing Machine"],
        images: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
        ],
        available_from: "2025-05-20",
        is_verified: false,
        verification_status: "pending",
        rating: 4.1,
        review_count: 8,
        views: 89,
        is_featured: false,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "3BHK Luxury Apartment",
        description: "Premium 3BHK apartment with all modern amenities. Gated society with 24/7 security. Close to Wakad bridge.",
        property_type: "flat",
        bhk: "3+ BHK",
        bathrooms: 3,
        area_sqft: 1400,
        floor: 8,
        total_floors: 15,
        rent: 32000,
        security_deposit: 96000,
        furnishing: "furnished",
        location_area: "Wakad",
        location_address: "Wakad, Near Xion Mall",
        location_city: "Pune",
        location_pincode: "411057",
        location_landmark: "Near Xion Mall",
        location_campus: "Indira College",
        amenities: ["WiFi", "Parking", "Lift", "Power Backup", "Security", "AC", "Gym", "Swimming Pool"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
          "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",
        ],
        available_from: "2025-07-01",
        is_verified: true,
        verification_status: "verified",
        rating: 4.9,
        review_count: 45,
        views: 520,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK Semi Furnished in Aundh",
        description: "Well-maintained 2BHK semi-furnished flat in upscale Aundh locality. Walking distance to Aundh IT Park.",
        property_type: "flat",
        bhk: "2 BHK",
        bathrooms: 2,
        area_sqft: 950,
        floor: 5,
        total_floors: 8,
        rent: 20000,
        security_deposit: 40000,
        furnishing: "semi-furnished",
        location_area: "Aundh",
        location_address: "Aundh Road, Near Westend Mall",
        location_city: "Pune",
        location_pincode: "411007",
        location_landmark: "Near Westend Mall",
        location_campus: "Fergusson College",
        amenities: ["WiFi", "Parking", "Lift", "Water Supply", "Balcony"],
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
        ],
        available_from: "2025-06-20",
        is_verified: true,
        verification_status: "verified",
        rating: 4.5,
        review_count: 22,
        views: 198,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "1BHK Furnished Near Pashan Lake",
        description: "Beautiful 1BHK furnished flat with lake view. Quiet and peaceful locality. Perfect for nature lovers.",
        property_type: "flat",
        bhk: "1 BHK",
        bathrooms: 1,
        area_sqft: 620,
        floor: 3,
        total_floors: 6,
        rent: 13500,
        security_deposit: 27000,
        furnishing: "furnished",
        location_area: "Pashan",
        location_address: "Pashan, Near NCL Colony",
        location_city: "Pune",
        location_pincode: "411021",
        location_landmark: "Near NCL Colony",
        location_campus: "IISER Pune",
        amenities: ["WiFi", "Parking", "Water Supply", "Balcony", "Security"],
        images: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        ],
        available_from: "2025-06-25",
        is_verified: false,
        verification_status: "pending",
        rating: 4.4,
        review_count: 15,
        views: 143,
        is_featured: false,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK Fully Furnished Baner",
        description: "Modern 2BHK fully furnished apartment in Baner. All amenities included. No brokerage.",
        property_type: "flat",
        bhk: "2 BHK",
        bathrooms: 2,
        area_sqft: 880,
        floor: 6,
        total_floors: 12,
        rent: 22000,
        security_deposit: 44000,
        furnishing: "furnished",
        location_area: "Baner",
        location_address: "Baner, Sus Road",
        location_city: "Pune",
        location_pincode: "411045",
        location_landmark: "Near Sus Road",
        location_campus: "MIT World Peace University",
        amenities: ["WiFi", "Parking", "Lift", "Power Backup", "AC", "Washing Machine", "Kitchen"],
        images: [
          "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        ],
        available_from: "2025-06-05",
        is_verified: true,
        verification_status: "verified",
        rating: 4.8,
        review_count: 38,
        views: 441,
        is_featured: true,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "1RK Near Wakad IT Park",
        description: "Budget-friendly 1RK ideal for working professionals. Easy commute to Hinjewadi and Wakad IT hubs.",
        property_type: "room",
        bhk: "1 RK",
        bathrooms: 1,
        area_sqft: 320,
        floor: 1,
        total_floors: 4,
        rent: 8500,
        security_deposit: 17000,
        furnishing: "semi-furnished",
        location_area: "Wakad",
        location_address: "Wakad, Near Shivaji Chowk",
        location_city: "Pune",
        location_pincode: "411057",
        location_landmark: "Near Shivaji Chowk",
        location_campus: "NIIT University",
        amenities: ["WiFi", "Water Supply", "Parking"],
        images: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        ],
        available_from: "2025-05-28",
        is_verified: false,
        verification_status: "pending",
        rating: 3.9,
        review_count: 6,
        views: 72,
        is_featured: false,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "3BHK Independent House Kothrud",
        description: "Spacious independent 3BHK house with private garden. Quiet residential area. Perfect for families.",
        property_type: "house",
        bhk: "3+ BHK",
        bathrooms: 2,
        area_sqft: 1600,
        floor: 1,
        total_floors: 2,
        rent: 35000,
        security_deposit: 70000,
        furnishing: "semi-furnished",
        location_area: "Kothrud",
        location_address: "Dahanukar Colony, Kothrud",
        location_city: "Pune",
        location_pincode: "411029",
        location_landmark: "Dahanukar Colony",
        location_campus: "Pune University",
        amenities: ["Parking", "Water Supply", "Security", "Balcony", "Kitchen", "Power Backup"],
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800",
        ],
        available_from: "2025-07-15",
        is_verified: true,
        verification_status: "verified",
        rating: 4.6,
        review_count: 19,
        views: 267,
        is_featured: false,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "1BHK Affordable Karve Nagar",
        description: "Clean and affordable 1BHK flat for students. Bus stop 100m away. Vegetarian preferred.",
        property_type: "flat",
        bhk: "1 BHK",
        bathrooms: 1,
        area_sqft: 480,
        floor: 2,
        total_floors: 4,
        rent: 9500,
        security_deposit: 19000,
        furnishing: "unfurnished",
        location_area: "Karve Nagar",
        location_address: "Karve Nagar, Sadashiv Peth Road",
        location_city: "Pune",
        location_pincode: "411052",
        location_landmark: "Sadashiv Peth Road",
        location_campus: "Garware College",
        amenities: ["Water Supply", "Security"],
        images: [
          "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800",
        ],
        available_from: "2025-06-08",
        is_verified: false,
        verification_status: "pending",
        rating: 4.0,
        review_count: 11,
        views: 95,
        is_featured: false,
      },
      {
        owner_id: SEED_OWNER_ID,
        title: "2BHK with Parking & Gym",
        description: "Premium 2BHK with dedicated parking, gym access and clubhouse facilities. Modern building.",
        property_type: "flat",
        bhk: "2 BHK",
        bathrooms: 2,
        area_sqft: 1050,
        floor: 9,
        total_floors: 18,
        rent: 28000,
        security_deposit: 56000,
        furnishing: "furnished",
        location_area: "Baner",
        location_address: "Baner, Near Balewadi Stadium",
        location_city: "Pune",
        location_pincode: "411045",
        location_landmark: "Near Balewadi Stadium",
        location_campus: "Symbiosis",
        amenities: ["WiFi", "Parking", "Lift", "Power Backup", "Security", "AC", "Gym", "Balcony"],
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
        ],
        available_from: "2025-06-30",
        is_verified: true,
        verification_status: "verified",
        rating: 4.8,
        review_count: 29,
        views: 389,
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

    // Seed area reviews
    if (insertedAreas?.length) {
      const areaMap = {};
      insertedAreas.forEach((a) => { areaMap[a.name] = a.id; });

      const reviews = [
        {
          area_id: areaMap["Kothrud"],
          user_id: SEED_OWNER_ID,
          safety_rating: 5,
          transport_rating: 4,
          food_rating: 4,
          water_rating: 4,
          internet_rating: 5,
          comment: "Great locality for students, peaceful and well connected.",
        },
        {
          area_id: areaMap["Karve Nagar"],
          user_id: SEED_OWNER_ID,
          safety_rating: 4,
          transport_rating: 4,
          food_rating: 5,
          water_rating: 3,
          internet_rating: 4,
          comment: "Nice and quiet area. Markets are very close by.",
        },
        {
          area_id: areaMap["Hinjewadi"],
          user_id: SEED_OWNER_ID,
          safety_rating: 4,
          transport_rating: 3,
          food_rating: 4,
          water_rating: 4,
          internet_rating: 5,
          comment: "Best area for IT professionals. Great internet and food options.",
        },
        {
          area_id: areaMap["Baner"],
          user_id: SEED_OWNER_ID,
          safety_rating: 5,
          transport_rating: 4,
          food_rating: 5,
          water_rating: 4,
          internet_rating: 5,
          comment: "Modern and upscale. Excellent restaurants and cafes.",
        },
      ];

      const validReviews = reviews.filter((r) => r.area_id);
      if (validReviews.length) {
        await supabaseAdmin.from("area_reviews").insert(validReviews);
      }
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

    const { data, error } = await supabaseAdmin.storage
      .from("stays-images")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabaseAdmin.storage
      .from("stays-images")
      .getPublicUrl(fileName);

    return res.json({ success: true, url: urlData.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: "Upload failed." });
  }
}
