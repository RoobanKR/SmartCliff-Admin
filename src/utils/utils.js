export const getAPIURL = () => {
    return process.env.NODE_ENV === "production"
      ? "https://app.claritynotes.io"
      : "http://localhost:5353";
  };