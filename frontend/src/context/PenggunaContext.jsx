import { createContext, useContext, useCallback, useState } from "react";

const PenggunaContext = createContext(null);

export function PenggunaProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Ambil Semua User (index)
  const getUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.index();
      setUsers(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Ambil Detail User berdasarkan ID (find)
  const getUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.find(id);
      setSelectedUser(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Tambah User Baru (store)
  const createUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.store(data);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Data User (update)
  const updateUser = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.update(id, data);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser : user)),
      );
      if (selectedUser?.id === id) {
        setSelectedUser(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 5. Hapus User (destroy)
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userService.destroy(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    users,
    selectedUser,
    loading,
    error,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
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
