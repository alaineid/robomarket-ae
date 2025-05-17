import { Metadata } from "next";
import { headers } from "next/headers";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import type { Product } from "@/types/product.types";

// Helper function to get base URL from headers
async function getBaseUrl() {
  const headersList = headers();
  const host = (await headersList).get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

// Generate metadata for each product page dynamically
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const baseUrl = await getBaseUrl();
  
  try {
    // Fetch product details from the API
    const response = await fetchWithAuth<Product>(`${baseUrl}/api/products/${id}`);
    const product = response;
    
    if (!product) {
      return {
        title: "Product Not Found | RoboMarket",
        description: "The requested product could not be found on RoboMarket.",
      };
    }
    
    return {
      title: `${product.name} | RoboMarket`,
      description: product.description?.substring(0, 160) || 
        "Explore this premium robot on RoboMarket, your source for advanced humanoid robots.",
      openGraph: {
        images: product.images && product.images.length > 0 
          ? [{ url: product.images[0].url }] 
          : undefined,
      },
    };
  } catch {
    // Fallback metadata if fetch fails
    return {
      title: "Robot Details | RoboMarket",
      description: "Explore premium robots on RoboMarket, your source for advanced humanoid robots.",
    };
  }
}
