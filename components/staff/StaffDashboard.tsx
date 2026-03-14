"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { UpdatePayload } from "@/types/socketPayload";

interface Patient {
    id: number
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    submittedAt: string
}

export default function StaffDashboard() {

    const socket = useSocket();

    const [activePatients, setActivePatients] = useState<any[]>([]);
    const [submittedPatients, setSubmittedPatients] = useState<any[]>([]);

    useEffect(() => {

        const handleUpdate = (payload: any) => {

            setActivePatients(payload.activePatients ?? []);

            if (payload.submittedPatients) {
                setSubmittedPatients(payload.submittedPatients);
            }

        };

        socket.on("update", handleUpdate);

        return () => {
            socket.off("update", handleUpdate);
        };

    }, [socket]);

    return (
        <div className="bg-white shadow rounded p-4 mb-6">

            <h2 className="font-semibold mb-3">
                Active Patients
            </h2>

            {activePatients.length === 0 && (
                <p className="text-gray-400">
                    No patients currently filling the form
                </p>
            )}

            {activePatients.map((patient) => (

                <div
                    key={patient.id}
                    className="flex justify-between border p-2 rounded mb-2 border-b-2 border-green-600"
                >
                    <div>
                        <strong>ID:</strong> {patient.id}
                    </div>
                    <div>
                        {patient.firstName} {patient.lastName}
                    </div>

                    <span className="text-green-600">
                        ● Typing
                    </span>

                </div>

            ))}
            <h2 className="font-semibold mb-4">
                Submitted Patients
            </h2>

            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Phone</th>
                            <th className="p-2 text-left">Submitted</th>
                        </tr>
                    </thead>

                    <tbody>

                        {submittedPatients.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center p-4 text-gray-400"
                                >
                                    No patients submitted yet
                                </td>
                            </tr>
                        )}

                        {submittedPatients.map((patient) => (

                            <tr key={patient.id} className="border-t">

                                <td className="p-2">
                                    {patient.firstName} {patient.lastName}
                                </td>

                                <td className="p-2">
                                    {patient.email}
                                </td>

                                <td className="p-2">
                                    {patient.phoneNumber}
                                </td>

                                <td className="p-2">
                                    {new Date(patient.submittedAt).toLocaleTimeString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}