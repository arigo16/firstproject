"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button, CircularProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Home() {
  const router = useRouter();

  const [loadFetch, setLoadFetch] = useState(true);
  const [dataFetch, setDataFetch] = useState([]);

  const logoutFunction = () => {
    Cookies.remove("token");

    router.push("/auth/login");
  };

  const fetchData = async () => {
    setLoadFetch(true);

    try {
      const response = await axios.get(
        "http://localhost:8000/api/kelasmalamtest",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      setDataFetch(response?.data?.data);
    } catch (e) {
      if (e?.status == 401) {
        logoutFunction();
      }
    } finally {
      setLoadFetch(false);
    }
  };

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.push("/auth/login");
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="bg-white grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>Selamat anda berhasil login</div>

        {loadFetch && <CircularProgress />}

        {!loadFetch && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>Merk</TableCell>
                  <TableCell>Color</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFetch.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.merk}</TableCell>
                    <TableCell>{row.color}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button variant="outlined" onClick={fetchData}>
          Refresh
        </Button>

        <Button variant="contained" onClick={logoutFunction}>
          Logout
        </Button>
      </main>
    </div>
  );
}
