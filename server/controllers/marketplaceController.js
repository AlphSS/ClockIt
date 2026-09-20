import crypto from "crypto";
import { supabaseAdmin } from "../config/supabase.js";

async function addSignedImageUrls(products) {
  for (const product of products) {
    if (!product.product_images) continue;

    for (const image of product.product_images) {
      // Extract the storage path from the saved URL
      const marker = "/marketplace-images/";
      const index = image.image_url.indexOf(marker);

      if (index === -1) continue;

      const filePath = image.image_url.substring(index + marker.length);

      const { data, error } = await supabaseAdmin.storage
        .from("marketplace-images")
        .createSignedUrl(filePath, 60 * 60);

      if (!error && data?.signedUrl) {
        image.image_url = data.signedUrl;
      }
    }
  }

  return products;
}

export async function getProducts(req, res) {
  try {
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        title,
        description,
        price,
        category,
        condition,
        is_negotiable,
        status,
        location,
        created_at,
        updated_at,

        profiles (
          id,
          username,
          full_name
        ),

        colleges (
          id,
          name
        ),

        product_images (
          id,
          image_url,
          display_order
        )
      `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get marketplace products error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch marketplace products.",
      });
    }

    await addSignedImageUrls(products);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get marketplace products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        seller_id,
        university_id,
        title,
        description,
        price,
        category,
        condition,
        is_negotiable,
        status,
        location,
        created_at,
        updated_at,

        profiles (
          id,
          username,
          full_name
        ),

        colleges (
          id,
          name
        ),

        product_images (
          id,
          image_url,
          display_order
        )
      `,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Get marketplace product error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch product.",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await addSignedImageUrls([product]);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get marketplace product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function createProduct(req, res) {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      price,
      category,
      condition,
      isNegotiable,
      location,
    } = req.body;

    // Basic validation
    if (!title || price === undefined || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: "Title, price, category and condition are required.",
      });
    }

    if (Number.isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number.",
      });
    }

    // Get authenticated user's profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, university_id, college_verified")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Get seller profile error:", profileError);

      return res.status(500).json({
        success: false,
        message: "Unable to verify seller profile.",
      });
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    // Only verified college users can sell
    if (!profile.college_verified) {
      return res.status(403).json({
        success: false,
        message: "Only verified college users can create listings.",
      });
    }

    // Seller must have a university
    if (!profile.university_id) {
      return res.status(400).json({
        success: false,
        message: "Please select your university before creating a listing.",
      });
    }

    // Create product
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({
        seller_id: userId,
        university_id: profile.university_id,
        title: title.trim(),
        description: description?.trim() || null,
        price: Number(price),
        category,
        condition,
        is_negotiable: Boolean(isNegotiable),
        location: location?.trim() || null,
      })
      .select()
      .single();

    if (productError) {
      console.error("Create product error:", productError);

      return res.status(500).json({
        success: false,
        message: "Unable to create product listing.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product listed successfully.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function getMyProducts(req, res) {
  try {
    const userId = req.user.id;

    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        id,
        title,
        description,
        price,
        category,
        condition,
        is_negotiable,
        status,
        location,
        created_at,
        updated_at,

        colleges (
          id,
          name
        ),

        product_images (
          id,
          image_url,
          display_order
        )
      `,
      )
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get my products error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch your listings.",
      });
    }

    await addSignedImageUrls(products);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get my products error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      price,
      category,
      condition,
      isNegotiable,
      location,
    } = req.body;

    // Check required fields
    if (!title || price === undefined || !category || !condition) {
      return res.status(400).json({
        success: false,
        message: "Title, price, category and condition are required.",
      });
    }

    // Validate price
    if (Number.isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number.",
      });
    }

    // Find the product and make sure it belongs to the logged-in user
    const { data: existingProduct, error: findError } = await supabaseAdmin
      .from("products")
      .select("id, seller_id")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      console.error("Find product error:", findError);

      return res.status(500).json({
        success: false,
        message: "Unable to find product.",
      });
    }

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (existingProduct.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own listings.",
      });
    }

    // Update product
    const { data: product, error: updateError } = await supabaseAdmin
      .from("products")
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        price: Number(price),
        category,
        condition,
        is_negotiable: Boolean(isNegotiable),
        location: location?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("seller_id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Update product error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Unable to update product.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check product ownership
    const { data: existingProduct, error: findError } = await supabaseAdmin
      .from("products")
      .select("id, seller_id")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      console.error("Find product error:", findError);

      return res.status(500).json({
        success: false,
        message: "Unable to find product.",
      });
    }

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (existingProduct.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own listings.",
      });
    }

    // Delete product
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)
      .eq("seller_id", userId);

    if (deleteError) {
      console.error("Delete product error:", deleteError);

      return res.status(500).json({
        success: false,
        message: "Unable to delete product.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function markProductAsSold(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check product ownership
    const { data: existingProduct, error: findError } = await supabaseAdmin
      .from("products")
      .select("id, seller_id, status")
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      console.error("Find product error:", findError);

      return res.status(500).json({
        success: false,
        message: "Unable to find product.",
      });
    }

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (existingProduct.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own listings.",
      });
    }

    if (existingProduct.status === "sold") {
      return res.status(400).json({
        success: false,
        message: "Product is already marked as sold.",
      });
    }

    // Mark product as sold
    const { data: product, error: updateError } = await supabaseAdmin
      .from("products")
      .update({
        status: "sold",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("seller_id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Mark product as sold error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Unable to mark product as sold.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product marked as sold.",
      product,
    });
  } catch (error) {
    console.error("Mark product as sold error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function uploadProductImage(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    // Check product ownership
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, seller_id")
      .eq("id", id)
      .maybeSingle();

    if (productError) {
      console.error("Find product error:", productError);

      return res.status(500).json({
        success: false,
        message: "Unable to find product.",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (product.seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only upload images to your own listings.",
      });
    }

    const file = req.file;

    // Create a unique storage path
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `${id}/${fileName}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("marketplace-images")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload image error:", uploadError);

      return res.status(500).json({
        success: false,
        message: "Unable to upload image.",
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("marketplace-images")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Get current number of images
    const { count, error: countError } = await supabaseAdmin
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", id);

    if (countError) {
      console.error("Count images error:", countError);
    }

    // Save image information in database
    const { data: image, error: imageError } = await supabaseAdmin
      .from("product_images")
      .insert({
        product_id: id,
        image_url: imageUrl,
        display_order: count || 0,
      })
      .select()
      .single();

    if (imageError) {
      console.error("Save product image error:", imageError);

      // Remove uploaded file if database insert fails
      await supabaseAdmin.storage.from("marketplace-images").remove([filePath]);

      return res.status(500).json({
        success: false,
        message: "Unable to save image information.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product image uploaded successfully.",
      image,
    });
  } catch (error) {
    console.error("Upload product image error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
