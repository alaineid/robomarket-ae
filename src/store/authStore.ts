import { create } from 'zustand';
import { type User } from '@supabase/supabase-js'; // Import User type from Supabase

/**
 * Interface defining the shape of the authentication state managed by Zustand.
 */
interface AuthState {
  user: User | null;        // Current authenticated user object, or null if not authenticated.
  isLoading: boolean;       // Flag to indicate if authentication status is currently being determined.
  sessionChecked: boolean;  // Flag to indicate if the initial session check has been performed.
  setUser: (user: User | null) => void; // Function to update the user object.
  setLoading: (loading: boolean) => void; // Function to update the loading state.
  setSessionChecked: (checked: boolean) => void; // Function to mark session as checked.
}

/**
 * Creates a Zustand store for managing client-side authentication state.
 * This store holds the user object and loading status.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Initially true, set to false after first auth check.
  sessionChecked: false, // Initially false, set to true after first onAuthStateChange or serverUser prop.
  /**
   * Updates the authenticated user in the store.
   * @param user - The Supabase user object or null.
   */
  setUser: (user) => set({ user, isLoading: false, sessionChecked: true }),
  /**
   * Updates the loading state.
   * @param loading - Boolean indicating if auth state is being loaded.
   */
  setLoading: (loading) => set({ isLoading: loading }),
  /**
   * Marks that the initial session check has been performed.
   * @param checked - Boolean indicating if the session has been checked.
   */
  setSessionChecked: (checked) => set({ sessionChecked: checked }),
}));
