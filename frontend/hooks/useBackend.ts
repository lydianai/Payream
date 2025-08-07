import { useState, useEffect } from "react";
import backend from "~backend/client";

// This is a simplified auth state management for the purpose of this example.
// In a real app, you would use a more robust solution like React Context or a state management library.
function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function useBackend() {
  const [client, setClient] = useState(() => {
    const token = getAuthToken();
    if (token) {
      return backend.with({ auth: `Bearer ${token}` });
    }
    return backend;
  });

  useEffect(() => {
    const updateClient = () => {
      const token = getAuthToken();
      setClient(token ? backend.with({ auth: `Bearer ${token}` }) : backend);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        updateClient();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for in-page auth changes
    window.addEventListener('authChange', updateClient);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', updateClient);
    };
  }, []);

  return client;
}
