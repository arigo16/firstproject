"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Alert, Button, Box, TextField, Typography } from "@mui/material";

import axios from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();

  const [loadSubmit, setLoadSubmit] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [messageError, setMessageError] = useState("");

  const submitLogin = async () => {
    setLoadSubmit(true);

    const dataLogin = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        dataLogin,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Cookies.set("token", response?.data?.access_token);
      router.replace("/");
    } catch (e) {
      setMessageError(e?.response?.data?.message);
    } finally {
      setLoadSubmit(false);
    }
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      router.push("/");
    }
  }, []);

  return (
    <div className="bg-white grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Box display="flex" flexDirection="column" gap={4} width={500}>
          <Typography>Welcome😊</Typography>

          {messageError != "" && <Alert severity="error">{messageError}</Alert>}

          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setMessageError("");
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessageError("");
            }}
          />

          <Button
            variant="contained"
            onClick={submitLogin}
            disabled={!username || !password || loadSubmit}
          >
            Login
          </Button>
        </Box>
      </main>
    </div>
  );
}
