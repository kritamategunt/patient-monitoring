"use client";

import { useState } from "react";
import { socket } from "@/lib/socket";

export default function PatientPage() {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e:any) => {
    const newData = {
      ...form,
      [e.target.name]: e.target.value
    };

    setForm(newData);

    socket.emit("patientUpdate", newData);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    socket.emit("submit");
  };

  return (
    <div className="max-w-xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-6">
        Patient Registration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

      </form>
    </div>
  );
}