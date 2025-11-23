// lib/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { supabase } from "./supabaseClient"; // <--- IMPORTANTE

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // ==============================
        // 🔥 Sincronizar com Supabase
        // ==============================
        await supabase
          .from("profiles")
          .upsert(
            {
              firebase_uid: firebaseUser.uid,
              nome: firebaseUser.displayName || null,
              avatar_url: firebaseUser.photoURL || null,
              telefone: firebaseUser.phoneNumber || null,
            },
            { onConflict: "firebase_uid" }
          );
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Carregando...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
