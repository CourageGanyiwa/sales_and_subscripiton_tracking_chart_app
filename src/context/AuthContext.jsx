import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log(data.session);
        setSession(data.session);
      } catch (error) {
        console.error("Error getting session", error.message);
      }
    };

    getInitialSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("session chanhged: ", session);
    });
  }, []);

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error("Supabasse sign-in error", error);
        return { success: false, error: error.message };
      }

      console.log("Supabase sign-in succes", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error durinng sign-in");
      return {
        success: false,
        error: "An unexpected error  occureed. Try again",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ session, signInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
