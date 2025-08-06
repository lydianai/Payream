import backend from "~backend/client";

export function useBackend() {
  // Return the backend client without authentication
  // In a real app with auth, this would handle token management
  return backend;
}
