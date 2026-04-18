// Redirect to Dashboard
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/stage1");
  }, []);
  return null;
}
