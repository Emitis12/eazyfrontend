import { useState, useEffect } from "react";
import axios from "../utils/api"; // pre-configured Axios instance

export default function useFetch(url, options = {}, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios(url, options);
        if (isMounted) setData(response.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data || err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, deps); // dependency array

  return { data, loading, error };
}
