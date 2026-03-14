"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export default function StaffPage() {

  const [data, setData] = useState<any>({});
  const [status, setStatus] = useState("inactive");

  useEffect(() => {

    socket.on("update", (payload) => {
      setData(payload.patientData);
      setStatus(payload.status);
    });

  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Staff Dashboard
      </h1>

      <div className="mb-4">
        Status:
        <span className="ml-2 font-semibold">
          {status}
        </span>
      </div>

      <div className="border p-4 rounded space-y-2">

        <p>First Name: {data.firstName}</p>
        <p>Last Name: {data.lastName}</p>
        <p>Email: {data.email}</p>
        <p>Phone: {data.phoneNumber}</p>

      </div>

    </div>
  );
}