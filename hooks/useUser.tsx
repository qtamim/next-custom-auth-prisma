import { useState, useEffect } from "react";
import axios from "axios";

const useUser = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    isVerfied: boolean;
  }>({ id: "", name: "", email: "", phoneNumber: "", isVerfied: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/auth/getUserData");
        setUser(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, loading, error };
};

export default useUser;
