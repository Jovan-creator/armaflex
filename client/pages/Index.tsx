// This file is now replaced by Dashboard.tsx as the main homepage
// Keeping for backwards compatibility but redirecting to dashboard
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}
