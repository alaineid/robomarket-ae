/**
 * Utility function to make authenticated API requests
 * This ensures all API requests include credentials and proper headers
 */

interface FetchWithAuthOptions extends RequestInit {
  skipCache?: boolean;
  timeoutMs?: number; // Add timeout option
}

export async function fetchWithAuth<T>(
  url: string,
  options: FetchWithAuthOptions = {},
): Promise<T> {
  const { skipCache = false, timeoutMs = 30000, ...fetchOptions } = options;

  // Default options for all requests
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      ...fetchOptions.headers,
      // Skip cache if needed
      ...(skipCache ? { "Cache-Control": "no-cache" } : {}),
    },
  };

  // Merge default options with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...fetchOptions,
    headers: {
      ...defaultOptions.headers,
      ...(fetchOptions.headers || {}),
    },
  };

  try {
    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      ...mergedOptions,
      signal: controller.signal,
    });

    // Clear timeout to prevent memory leaks
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => "No error details available");
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // For 204 No Content responses, return null
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);

    // Provide more helpful error message for timeout errors
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        `Request timeout: The request to ${url} took too long to complete (exceeded ${timeoutMs}ms)`,
      );
    }

    throw error;
  }
}
