import { supabase } from "./supabase";

const API_URL = "http://localhost:5800/api/marketplace";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You are not logged in.");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

// Get all active products
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch products.");
  }

  return data;
}

// Get single product
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch product.");
  }

  return data;
}

// Get current user's listings
export async function getMyProducts() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/my-products`, {
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to fetch your listings."
    );
  }

  return data.products;
}

// Create product
export async function createProduct(productData) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create product.");
  }

  return data;
}

// Update product
export async function updateProduct(id, productData) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update product.");
  }

  return data;
}

// Delete product
export async function deleteProduct(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete product.");
  }

  return data;
}

// Mark product as sold
export async function markProductAsSold(id) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/products/${id}/sold`, {
    method: "PATCH",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to mark product as sold.");
  }

  return data;
}

// Upload product image
export async function uploadProductImage(productId, imageFile) {
  const headers = await getAuthHeaders();

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_URL}/products/${productId}/images`, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to upload image.");
  }

  return data;
}
