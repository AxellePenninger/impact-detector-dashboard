// Simple client-side auth state management
export const setLoggedIn = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("isLoggedIn", "true")
  }
}

export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true"
  }
  return false
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn")
  }
}
