export const getAuth = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) return null;

  return {
    token,
    user: JSON.parse(user),
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
