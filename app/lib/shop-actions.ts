"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";

// Use the singleton Prisma client

// Add to cart schema
const AddToCartSchema = z.object({
  productId: z.string().optional(),
  bundleId: z.string().optional(),
  quantity: z.number().min(1).default(1),
});

export type AddToCartState = {
  errors?: {
    productId?: string[];
    bundleId?: string[];
    quantity?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// Add to cart action
export async function addToCart(prevState: AddToCartState, formData: FormData) {
  const session = await auth();

  // We'll allow both logged-in and guest users to add items to cart
  // For logged-in users, we'll save to the database
  // For guests, we'll just return success (in a real app, we might use cookies)

  const validatedFields = AddToCartSchema.safeParse({
    productId: formData.get("productId") || undefined,
    bundleId: formData.get("bundleId") || undefined,
    quantity: Number(formData.get("quantity")) || 1,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to add item to cart.",
      success: false,
    };
  }

  const { productId, bundleId, quantity } = validatedFields.data;

  if (!productId && !bundleId) {
    return {
      message: "Either productId or bundleId is required.",
      success: false,
    };
  }

  try {
    // Only save to database if user is logged in
    if (session?.user?.id) {
      // Verify the user exists in the database
      const user = await db.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return {
          message: "User not found in database.",
          success: false,
        };
      }

      // Get or create user cart
      let cart = await db.cart.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!cart) {
        try {
          cart = await db.cart.create({
            data: {
              userId: user.id,
            },
          });
        } catch (error) {
          console.error("Error creating cart:", error);
          return {
            message: "Failed to create cart.",
            success: false,
          };
        }
      }

      // Check if item already exists in cart
      const existingItem = await db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId || null,
          bundleId: bundleId || null,
        },
      });

      if (existingItem) {
        // Update quantity
        await db.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        // Add new item
        await db.cartItem.create({
          data: {
            cartId: cart.id,
            productId: productId || null,
            bundleId: bundleId || null,
            quantity,
          },
        });
      }
    } else {
      // For non-logged in users, we'll just return success
      // In a real app, we might store this in a cookie or local storage
      console.log("User not logged in, cart will not persist");
    }

    revalidatePath("/shop/cart");

    return {
      message: "Item added to cart successfully.",
      success: true,
    };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return {
      message: "Failed to add item to cart. Please try again.",
      success: false,
    };
  }
}

// Update cart item schema
const UpdateCartItemSchema = z.object({
  cartItemId: z.string(),
  quantity: z.number().min(1),
});

export type UpdateCartItemState = {
  errors?: {
    cartItemId?: string[];
    quantity?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// Update cart item action
export async function updateCartItem(
  prevState: UpdateCartItemState,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "You must be logged in to update your cart.",
      success: false,
    };
  }

  const validatedFields = UpdateCartItemSchema.safeParse({
    cartItemId: formData.get("cartItemId"),
    quantity: Number(formData.get("quantity")),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to update cart item.",
      success: false,
    };
  }

  const { cartItemId, quantity } = validatedFields.data;

  try {
    // Only update in database if user is logged in
    if (session?.user?.id) {
      // Verify the user exists in the database
      const user = await db.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return {
          message: "User not found in database.",
          success: false,
        };
      }

      // Verify the cart item belongs to the user
      const cartItem = await db.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
        include: {
          cart: true,
        },
      });

      if (!cartItem || cartItem.cart.userId !== user.id) {
        return {
          message: "Cart item not found or does not belong to you.",
          success: false,
        };
      }

      // Update quantity
      await db.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity,
        },
      });
    } else {
      // For non-logged in users, we'll just return success
      console.log("User not logged in, cart changes will not persist");
    }

    revalidatePath("/shop/cart");

    return {
      message: "Cart updated successfully.",
      success: true,
    };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      message: "Failed to update cart item. Please try again.",
      success: false,
    };
  }
}

// Remove cart item schema
const RemoveCartItemSchema = z.object({
  cartItemId: z.string(),
});

export type RemoveCartItemState = {
  errors?: {
    cartItemId?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// Remove cart item action
export async function removeCartItem(
  prevState: RemoveCartItemState,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "You must be logged in to update your cart.",
      success: false,
    };
  }

  const validatedFields = RemoveCartItemSchema.safeParse({
    cartItemId: formData.get("cartItemId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to remove cart item.",
      success: false,
    };
  }

  const { cartItemId } = validatedFields.data;

  try {
    // Only remove from database if user is logged in
    if (session?.user?.id) {
      // Verify the user exists in the database
      const user = await db.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return {
          message: "User not found in database.",
          success: false,
        };
      }

      // Verify the cart item belongs to the user
      const cartItem = await db.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
        include: {
          cart: true,
        },
      });

      if (!cartItem || cartItem.cart.userId !== user.id) {
        return {
          message: "Cart item not found or does not belong to you.",
          success: false,
        };
      }

      // Remove item
      await db.cartItem.delete({
        where: {
          id: cartItemId,
        },
      });
    } else {
      // For non-logged in users, we'll just return success
      console.log("User not logged in, cart changes will not persist");
    }

    revalidatePath("/shop/cart");

    return {
      message: "Item removed from cart successfully.",
      success: true,
    };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return {
      message: "Failed to remove cart item. Please try again.",
      success: false,
    };
  }
}

// Create order schema
const CreateOrderSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export type CreateOrderState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    address?: string[];
    city?: string[];
    state?: string[];
    zipCode?: string[];
    country?: string[];
  };
  message?: string | null;
  success?: boolean;
  orderId?: string;
};

// Create an order from the cart
export async function createOrder(
  prevState: CreateOrderState,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user) {
    return {
      message: "You must be logged in to place an order",
      success: false,
    };
  }

  const validatedFields = CreateOrderSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state") || "",
    zipCode: formData.get("zipCode"),
    country: formData.get("country"),
  });

  // Get coupon information from form data
  const couponId = formData.get("couponId") as string;
  const couponDiscount = formData.get("couponDiscount") as string;

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check the form for errors",
      success: false,
    };
  }

  const { firstName, lastName, email, address, city, state, zipCode, country } =
    validatedFields.data;

  let orderId: string;

  try {
    console.log("Creating order with validated data:", {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zipCode,
      country,
    });

    // Create shipping and billing info
    const shippingInfo = {
      name: `${firstName} ${lastName}`,
      email,
      address,
      city,
      state,
      zipCode,
      country,
    };

    // Verify the user exists in the database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return {
        message: "User not found in database.",
        success: false,
      };
    }

    // Get the user's cart
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
            bundle: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        message: "Your cart is empty",
        success: false,
      };
    }

    // Calculate total
    let subtotal = 0;
    const orderItems = cart.items.map((item) => {
      const product = item.product;
      const bundle = item.bundle;

      let price = 0;
      let name = "";

      if (product) {
        price = Number(product.salePrice || product.price);
        name = product.name;
      } else if (bundle) {
        price = Number(bundle.salePrice || bundle.price);
        name = bundle.name;
      }

      subtotal += price * item.quantity;

      return {
        name,
        price,
        quantity: item.quantity,
        productId: product?.id || null,
        bundleId: bundle?.id || null,
      };
    });

    // Apply coupon discount if provided
    let discount = 0;
    if (couponDiscount) {
      discount = parseFloat(couponDiscount);
    }

    const total = Math.max(0, subtotal - discount); // Ensure total doesn't go below 0

    // Generate a random order number
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    // Create the order
    console.log("Creating order with data:", {
      orderNumber,
      total,
      orderItems,
    });
    const order = await db.order.create({
      data: {
        orderNumber,
        status: "pending",
        total,
        paymentStatus: "paid", // Assume payment is successful for this demo
        shippingInfo,
        billingInfo: shippingInfo, // Same as shipping for this demo
        userId: user.id,
        items: {
          create: orderItems,
        },
      },
    });

    console.log("Order created successfully:", order.id);

    // Increment coupon usage if a coupon was applied
    if (couponId) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/coupons/use`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ couponId }),
        });
        console.log("Coupon usage incremented for coupon:", couponId);
      } catch (error) {
        console.error("Error incrementing coupon usage:", error);
        // Don't fail the order if coupon tracking fails
      }
    }

    // Clear the cart after successful order
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    revalidatePath("/shop/cart");
    revalidatePath("/dashboard/orders");

    console.log("Order created successfully, ID:", order.id);
    console.log("Redirecting to success page with orderId:", order.id);
    console.log("Redirect URL:", `/shop/checkout/success?orderId=${order.id}`);

    // Small delay to ensure database transaction is committed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Store order ID for redirect
    orderId = order.id;
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      message: "Failed to create order. Please try again.",
      success: false,
    };
  }

  // Redirect to success page with the order ID (outside try-catch to avoid catching NEXT_REDIRECT)
  redirect(`/shop/checkout/success?orderId=${orderId}`);
}
