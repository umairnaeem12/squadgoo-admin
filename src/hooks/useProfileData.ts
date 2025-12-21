"use client";
import { useEffect, useState } from "react";
import type { ProfilePayload } from "@/types/profile";

type FetchStatus = "idle" | "loading" | "success" | "error";

export const useProfileData = () => {
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    fetch("/api/profile", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData)
      .then(() => setStatus("success"))
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  return { data, status, error };
};
