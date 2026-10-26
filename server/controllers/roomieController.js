import { supabaseAdmin } from "../config/supabase.js";

export async function createRoomieListing(req, res) {
  try {
    const userId = req.user.id;

    const {
      listingType,
      title,
      description,
      location,
      bhk,
      monthlyRent,
      minBudget,
      maxBudget,
      availableFrom,
      roommatesNeeded,
      furnishing,
      amenities,
    } = req.body;

    if (!listingType || !title || !location) {
      return res.status(400).json({
        success: false,
        message: "Listing type, title and location are required.",
      });
    }

    if (!["HAS_PLACE", "LOOKING_FOR_PLACE"].includes(listingType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing type.",
      });
    }

    // --------------------------------------------------
    // CHECK COLLEGE VERIFICATION
    // --------------------------------------------------

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, college_verified")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Profile lookup error:", profileError);

      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    if (!profile.college_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your college email before creating a listing.",
      });
    }

    // --------------------------------------------------
    // TYPE-SPECIFIC VALIDATION
    // --------------------------------------------------

    if (listingType === "HAS_PLACE") {
      if (!monthlyRent) {
        return res.status(400).json({
          success: false,
          message: "Monthly rent is required when you have a place.",
        });
      }

      if (!roommatesNeeded) {
        return res.status(400).json({
          success: false,
          message: "Number of roommates needed is required.",
        });
      }
    }

    if (listingType === "LOOKING_FOR_PLACE") {
      if (!minBudget && !maxBudget) {
        return res.status(400).json({
          success: false,
          message: "Please provide your budget.",
        });
      }
    }

    if (
      minBudget !== null &&
      minBudget !== undefined &&
      maxBudget !== null &&
      maxBudget !== undefined &&
      Number(minBudget) > Number(maxBudget)
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum budget cannot be greater than maximum budget.",
      });
    }

    // --------------------------------------------------
    // CREATE LISTING
    // --------------------------------------------------

    const { data: listing, error: listingError } = await supabaseAdmin
      .from("roomie_listings")
      .insert({
        user_id: userId,
        listing_type: listingType,
        title: title.trim(),
        description: description?.trim() || null,
        location: location.trim(),
        bhk: bhk || null,
        monthly_rent:
          monthlyRent !== undefined &&
          monthlyRent !== null &&
          monthlyRent !== ""
            ? Number(monthlyRent)
            : null,
        min_budget:
          minBudget !== undefined &&
          minBudget !== null &&
          minBudget !== ""
            ? Number(minBudget)
            : null,
        max_budget:
          maxBudget !== undefined &&
          maxBudget !== null &&
          maxBudget !== ""
            ? Number(maxBudget)
            : null,
        available_from: availableFrom || null,
        roommates_needed:
          roommatesNeeded !== undefined &&
          roommatesNeeded !== null &&
          roommatesNeeded !== ""
            ? Number(roommatesNeeded)
            : null,
        furnishing: furnishing || null,
        amenities: Array.isArray(amenities) ? amenities : [],
        status: "ACTIVE",
      })
      .select()
      .single();

    if (listingError) {
      console.error("Create listing error:", listingError);

      return res.status(500).json({
        success: false,
        message: "Unable to create listing.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Roomie listing created successfully.",
      listing,
    });
  } catch (error) {
    console.error("Create roomie listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}


// ======================================================
// GET ALL ACTIVE LISTINGS
// ======================================================

export async function getRoomieListings(req, res) {
  try {
    const {
      search,
      listingType,
      location,
      bhk,
      furnishing,
      minBudget,
      maxBudget,
      moveInFrom,
    } = req.query;

    let query = supabaseAdmin
      .from("roomie_listings")
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          college_verified,
          profile_picture,
          university_id,
          colleges (
            id,
            name
          )
        )
      `)
      .eq("status", "ACTIVE")
      .order("created_at", {
        ascending: false,
      });

    if (listingType) {
      query = query.eq("listing_type", listingType);
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (bhk) {
      query = query.eq("bhk", bhk);
    }

    if (furnishing) {
      query = query.eq("furnishing", furnishing);
    }

    if (minBudget) {
      query = query.gte("max_budget", Number(minBudget));
    }

    if (maxBudget) {
      query = query.lte("min_budget", Number(maxBudget));
    }

    if (moveInFrom) {
      query = query.gte("available_from", moveInFrom);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get listings error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch roomie listings.",
      });
    }

    let listings = data || [];

    // Search title, description, location and college name.
    if (search?.trim()) {
      const searchTerm = search.trim().toLowerCase();

      listings = listings.filter((listing) => {
        const collegeName =
          listing.profiles?.colleges?.name || "";

        const searchableText = [
          listing.title,
          listing.description,
          listing.location,
          listing.bhk,
          listing.furnishing,
          listing.profiles?.full_name,
          listing.profiles?.username,
          collegeName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchTerm);
      });
    }

    return res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Get roomie listings error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}


// ======================================================
// GET SINGLE LISTING
// ======================================================

export async function getRoomieListingById(req, res) {
  try {
    const { id } = req.params;

    const { data: listing, error } = await supabaseAdmin
      .from("roomie_listings")
      .select(`
        *,
        profiles (
          id,
          username,
          full_name,
          college_verified,
          profile_picture,
          university_id,
          colleges (
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error || !listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Get listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}


// ======================================================
// GET MY LISTINGS
// ======================================================

export async function getMyRoomieListings(req, res) {
  try {
    const userId = req.user.id;

    const { data: listings, error } = await supabaseAdmin
      .from("roomie_listings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Get my listings error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch your listings.",
      });
    }

    return res.status(200).json({
      success: true,
      listings: listings || [],
    });
  } catch (error) {
    console.error("Get my listings error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}


// ======================================================
// UPDATE LISTING
// ======================================================

export async function updateRoomieListing(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      listingType,
      title,
      description,
      location,
      bhk,
      monthlyRent,
      minBudget,
      maxBudget,
      availableFrom,
      roommatesNeeded,
      furnishing,
      amenities,
      status,
    } = req.body;

    const { data: existingListing, error: existingError } =
      await supabaseAdmin
        .from("roomie_listings")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

    if (existingError || !existingListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or you do not own this listing.",
      });
    }

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (listingType !== undefined) {
      if (!["HAS_PLACE", "LOOKING_FOR_PLACE"].includes(listingType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing type.",
        });
      }

      updates.listing_type = listingType;
    }

    if (title !== undefined) {
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    if (location !== undefined) {
      updates.location = location.trim();
    }

    if (bhk !== undefined) {
      updates.bhk = bhk || null;
    }

    if (monthlyRent !== undefined) {
      updates.monthly_rent =
        monthlyRent === "" || monthlyRent === null
          ? null
          : Number(monthlyRent);
    }

    if (minBudget !== undefined) {
      updates.min_budget =
        minBudget === "" || minBudget === null
          ? null
          : Number(minBudget);
    }

    if (maxBudget !== undefined) {
      updates.max_budget =
        maxBudget === "" || maxBudget === null
          ? null
          : Number(maxBudget);
    }

    if (availableFrom !== undefined) {
      updates.available_from = availableFrom || null;
    }

    if (roommatesNeeded !== undefined) {
      updates.roommates_needed =
        roommatesNeeded === "" || roommatesNeeded === null
          ? null
          : Number(roommatesNeeded);
    }

    if (furnishing !== undefined) {
      updates.furnishing = furnishing || null;
    }

    if (amenities !== undefined) {
      updates.amenities = Array.isArray(amenities)
        ? amenities
        : [];
    }

    if (status !== undefined) {
      if (!["ACTIVE", "PAUSED", "CLOSED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid listing status.",
        });
      }

      updates.status = status;
    }

    const { data: listing, error: updateError } = await supabaseAdmin
      .from("roomie_listings")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Update listing error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Unable to update listing.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully.",
      listing,
    });
  } catch (error) {
    console.error("Update listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}


// ======================================================
// DELETE LISTING
// ======================================================

export async function deleteRoomieListing(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("roomie_listings")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Delete listing error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to delete listing.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    console.error("Delete listing error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}