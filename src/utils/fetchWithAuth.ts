/**
 * Utility function to make authenticated API requests
 * This ensures all API requests include credentials and proper headers
 */

interface FetchWithAuthOptions extends RequestInit {
  skipCache?: boolean;
}

export async function fetchWithAuth<T>(url: string, options: FetchWithAuthOptions = {}): Promise<T> {
  const { skipCache = false, ...fetchOptions } = options;
  
  // Default options for all requests
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      ...fetchOptions.headers,
      // Skip cache if needed
      ...(skipCache ? { 'Cache-Control': 'no-cache' } : {}),
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
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // For 204 No Content responses, return null
    if (response.status === 204) {
      return null as T;
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}
