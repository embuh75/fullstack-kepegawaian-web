import { create } from "zustand";

const STORAGE_KEY = "kepegawaian_auth";

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, user: null };
    return JSON.parse(raw);
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

const persist = (state) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      user: state.user,
    }),
  );
};

const initial = loadInitial();

export const useAuthStore = create((set, get) => ({
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  user: initial.user, // { id, username, email, role, permissions }

  isAuthenticated: () => !!get().accessToken,

  hasPermission: (perm) => {
    const user = get().user;
    if (!user || !user.permissions) return false;
    return user.permissions.includes(perm);
  },

  hasRole: (...roles) => {
    const user = get().user;
    if (!user) return false;
    return roles.includes(user.role);
  },

  // Called after successful login (full payload incl. user)
  setSession: ({ accessToken, refreshToken, user }) => {
    const next = { accessToken, refreshToken, user };
    set(next);
    persist({ ...get(), ...next });
  },

  // Called after token refresh (NOTE: backend refresh endpoint does NOT
  // return a `user` object, so existing user data in the store is kept)
  setTokens: ({ accessToken, refreshToken }) => {
    set({ accessToken, refreshToken });
    persist(get());
  },

  // Update user/profile (e.g. from GET /auth/me)
  setUser: (user) => {
    set({ user });
    persist(get());
  },

  clearSession: () => {
    set({ accessToken: null, refreshToken: null, user: null });
    localStorage.removeItem(STORAGE_KEY);
  },
}));
