import { create } from 'zustand';

interface ConnectsState {
  balance: number | null;   // null = not yet loaded
  setBalance:       (balance: number)  => void;
  incrementBalance: (amount: number)   => void;
  decrementBalance: (amount: number)   => void;
  reset:            ()                 => void;
}

/**
 * Global Zustand store for the contractor's connects balance.
 * Any component can read and update the balance without a fetch.
 *
 * Usage:
 *   const { balance, decrementBalance } = useConnectsStore();
 */
export const useConnectsStore = create<ConnectsState>((set) => ({
  balance: null,

  setBalance: (balance) => set({ balance }),

  incrementBalance: (amount) =>
    set((state) => ({ balance: (state.balance ?? 0) + amount })),

  decrementBalance: (amount) =>
    set((state) => ({
      balance: Math.max(0, (state.balance ?? 0) - amount),
    })),

  reset: () => set({ balance: null }),
}));
