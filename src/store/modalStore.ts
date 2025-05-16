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
export const useModalStore = create<ModalState>((set, get) => ({
  isLoginOpen: false,
  returnUrl: null,
  showLogin: (returnUrl = null) => {
    console.log('ModalStore: showLogin called, setting isLoginOpen to true');
    set({ isLoginOpen: true, returnUrl });
  },
  hideLogin: () => {
    console.log('ModalStore: hideLogin called, setting isLoginOpen to false');
    set({ isLoginOpen: false });
    // Log the current state after a short delay to verify the state change
    setTimeout(() => {
      const currentState = get();
      console.log('ModalStore: Current state after hideLogin:', currentState);
    }, 50);
  },
}));
