import { create } from 'zustand';
import { type User } from '@supabase/supabase-js'; // Import User type from Supabase

// Define customer profile interface
interface CustomerProfile {
  id: string;
  auth_user_id: string;
  first_name?: string;
  last_name?: string; 
}

/**
 * Interface defining the shape of the authentication state managed by Zustand.
 */
interface AuthState {
  user: User | null;        // Current authenticated user object, or null if not authenticated.
  customer: CustomerProfile | null; // Customer profile object, or null if not loaded.
  isLoading: boolean;       // Flag to indicate if authentication status is currently being determined.
  sessionChecked: boolean;  // Flag to indicate if the initial session check has been performed.
  setUser: (user: User | null) => void; // Function to update the user object.
  setLoading: (loading: boolean) => void; // Function to update the loading state.
  setSessionChecked: (checked: boolean) => void; // Function to mark session as checked.
  synchronizeAuthState: () => Promise<User | null>; // Function to fetch current auth state from Supabase and update the store.
}

/**
 * Creates a Zustand store for managing client-side authentication state.
 * This store holds the user object and loading status.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  customer: null, // Customer profile object, initially null.
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
  /**
   * Fetches the current auth state from Supabase and synchronizes the store.
   * Returns the user if found, null otherwise.
   */
  synchronizeAuthState: async () => {
    try {
      set({ isLoading: true });
      // Dynamic import to avoid circular dependencies
      const { createClient } = await import('@/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user || null;

      let customer = null;
      if (user) {
        // Fetch customer profile if user is logged in
        try {
          const { data: customerData, error } = await supabase
            .from('customers')
            .select('*')
            .eq('auth_user_id', user.id)
            .single();
            
          if (!error) {
            customer = customerData;
          } else {
            console.error('Error fetching customer profile:', error);
          }
        } catch (profileError) {
          console.error('Error in customer profile fetch:', profileError);
        }
      }
      
      set({ 
        customer, // Set the customer profile in the store
        user,
        isLoading: false,
        sessionChecked: true
      });
      
      // Dispatch a custom event for other components to react to
      window.dispatchEvent(new Event('auth-state-synchronized'));
      
      return user;
    } catch (error) {
      console.error('Error synchronizing auth state:', error);
      set({ isLoading: false, sessionChecked: true });
      return null;
    }
  },
}));
