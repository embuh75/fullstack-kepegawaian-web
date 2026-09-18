import { createContext, useContext, useEffect, useState } from "react";
import {
  store,
  index,
  find,
  update,
  destroy,
} from "../services/penggunaService";

const PenggunaContext = createContext(null);

export function PenggunaProvider({ children }) {
  async function daftar(data) {
    try {
      const pengguna = await store(data);
      return pengguna;
    } catch (error) {
      throw error;
    }
  }

  async function penggunas() {
    try {
      const pengguna = await index();
      return pengguna;
    } catch (error) {
      throw error;
    }
  }

  async function pengguna(id) {
    try {
      const pengguna = await find(id);
      return pengguna;
    } catch (error) {
      throw error;
    }
  }

  async function perbarui(id, data) {
    try {
      const pengguna = await update(id, data);
      return pengguna;
    } catch (error) {
      throw error;
    }
  }

  async function hapus(id) {
    try {
      const pengguna = await destroy(id);
      return pengguna;
    } catch (error) {
      throw error;
    }
  }

  const value = {
    daftar,
    penggunas,
    pengguna,
    perbarui,
    hapus,
  };

  return (
    <PenggunaContext.Provider value={value}>
      {children}
    </PenggunaContext.Provider>
  );
}

export function usePengguna() {
  const ctx = useContext(PenggunaContext);

  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }

  return ctx;
}
