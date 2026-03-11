import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /**
   * Becomes `true` once Zustand has finished reading the persisted state
   * from localStorage. Until this is true, `isAuthenticated` may still be
   * the initial `false` default — do NOT redirect to login before then.
   */
  _hasHydrated: boolean;

  setUser:        (user: User, token: string) => void;
  updateUser:     (data: Partial<User>) => void;
  logout:         () => void;
  setLoading:     (loading: boolean) => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,
      _hasHydrated:    false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      setUser: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('biddaro_token', token);
        }
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('biddaro_token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'biddaro-auth',
      // Only persist the essential fields — _hasHydrated must NOT be persisted
      // so it always starts as false and gets set to true by onRehydrateStorage.
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage → store rehydration is complete
        state?.setHasHydrated(true);
      },
    }
  )
);
