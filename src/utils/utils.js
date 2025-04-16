export const getAPIURL = () => {
    return process.env.NODE_ENV === "production"
      ? "https://smartcliff-server-5qpp.onrender.com"
      : "http://localhost:5353";
  };