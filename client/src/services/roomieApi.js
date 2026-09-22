import { supabase } from "./supabase";

const API_URL = "http://localhost:5800/api";

async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("You are not logged in.");
  }

  return session.access_token;
}


// ======================================================
// CREATE LISTING
// ======================================================

export async function createRoomieListing(listingData) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/roomies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listingData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to create listing."
    );
  }

  return result;
}


// ======================================================
// GET LISTINGS
// ======================================================

export async function getRoomieListings(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}/roomies${
      queryString ? `?${queryString}` : ""
    }`,
    {
      method: "GET",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to fetch roomies."
    );
  }

  return result.listings;
}


// ======================================================
// GET SINGLE LISTING
// ======================================================

export async function getRoomieListingById(id) {
  const response = await fetch(
    `${API_URL}/roomies/${id}`,
    {
      method: "GET",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to fetch listing."
    );
  }

  return result.listing;
}


// ======================================================
// GET MY LISTINGS
// ======================================================

export async function getMyRoomieListings() {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/roomies/user/me/listings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to fetch your listings."
    );
  }

  return result.listings;
}


// ======================================================
// UPDATE LISTING
// ======================================================

export async function updateRoomieListing(
  id,
  listingData
) {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/roomies/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to update listing."
    );
  }

  return result.listing;
}


// ======================================================
// DELETE LISTING
// ======================================================

export async function deleteRoomieListing(id) {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/roomies/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to delete listing."
    );
  }

  return result;
}