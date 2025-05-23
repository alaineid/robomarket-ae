import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Define types for request body
interface CheckoutItem {
  product: {
    name?: string;
    best_vendor?: {
      price: number;
    };
    images?: {
      url: string;
    }[];
  };
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface CheckoutRequestBody {
  cartItems: CheckoutItem[];
  shippingInfo: ShippingInfo;
  customerEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as CheckoutRequestBody;

    // Extract the necessary data from the request body
    const { cartItems, shippingInfo, customerEmail } = body;

    // Create line items for Stripe checkout
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "AED", // Using AED as required
        product_data: {
          name: item.product?.name || "Unnamed Product",
          images: item.product?.images?.[0]?.url
            ? [item.product.images[0].url]
            : [],
        },
        unit_amount: Math.round((item.product?.best_vendor?.price || 0) * 100), // Convert to cents (smallest currency unit)
      },
      quantity: item.quantity,
    }));

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/payments/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/payments/stripe/cancel`,
      customer_email: customerEmail,
      metadata: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        phone: shippingInfo.phone,
      },
    });

    // Return the session URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    // Type guard for Error objects
    if (error instanceof Error) {
      return NextResponse.json(
        { error: { message: error.message } },
        { status: 500 },
      );
    } else {
      // For non-Error objects
      return NextResponse.json(
        { error: { message: "An unknown error occurred" } },
        { status: 500 },
      );
    }
  }
}
