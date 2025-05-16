import { create } from 'zustand';

/**
 * Interface defining the shape of the modal state managed by Zustand.
 */
interface ModalState {
  isLoginOpen: boolean;
  returnUrl: string | null;
  showLogin: (returnUrl?: string | null) => void;
  hideLogin: () => void;
}

/**
 * Creates a Zustand store for managing modal state.
 * This store handles the visibility of the login modal.
 */
export const useModalStore = create<ModalState>((set) => ({
  isLoginOpen: false,
  returnUrl: null,
  showLogin: (returnUrl = null) => set({ isLoginOpen: true, returnUrl }),
  hideLogin: () => set({ isLoginOpen: false }),
}));
