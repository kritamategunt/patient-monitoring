"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { patientSchema } from "@/schemas/patientSchema";
import { PatientFormData } from "@/types/patient";
import { useSocket } from "@/context/SocketProvider";

import { UserIcon, PhoneIcon, MapPinIcon, HeartIcon } from "lucide-react";

export default function PatientForm() {

    const socket = useSocket();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            phoneNumber: "",
            email: "",
            address: "",
            nationality: "",
            preferredLanguage: "",
            emergencyContactName: "",
            emergencyContactRelationship: "",
            religion: "",
        },
    });

    const values = watch();

    // realtime typing updates
    useEffect(() => {
        const handler = setTimeout(() => {
            socket.emit("patientUpdate", values);
        }, 300);

        return () => clearTimeout(handler);

    }, [values, socket]);

    const onSubmit = (data: PatientFormData) => {
        socket.emit("submit", data);
    };

    return (
        <div className="min-h-screen border-t-4 border-blue-600 py-10">
            <div className="max-w-4xl mx-auto p-6">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8"
                >

                    {/* PERSONAL INFO */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-4">

                        <div className="flex items-center gap-2 font-semibold">
                            <UserIcon size={18} />
                            Personal Information
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">

                            <input
                                {...register("firstName")}
                                placeholder="First Name"
                                className="input"
                            />

                            <input
                                {...register("middleName")}
                                placeholder="Middle Name"
                                className="input"
                            />

                            <input
                                {...register("lastName")}
                                placeholder="Last Name"
                                className="input"
                            />

                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                type="date"
                                {...register("dateOfBirth")}
                                className="input"
                            />

                            <select
                                {...register("gender")}
                                className="input"
                            >
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Non-binary</option>
                            </select>

                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                {...register("nationality")}
                                placeholder="Nationality"
                                className="input"
                            />

                            <input
                                {...register("religion")}
                                placeholder="Religion (optional)"
                                className="input"
                            />

                        </div>

                    </section>

                    {/* CONTACT */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-4">

                        <div className="flex items-center gap-2 font-semibold">
                            <PhoneIcon size={18} />
                            Contact Details
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                {...register("phoneNumber")}
                                placeholder="Phone Number"
                                className="input"
                            />

                            <input
                                {...register("email")}
                                placeholder="Email"
                                className="input"
                            />

                        </div>

                    </section>

                    {/* ADDRESS */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-4">

                        <div className="flex items-center gap-2 font-semibold">
                            <MapPinIcon size={18} />
                            Address & Preferences
                        </div>

                        <textarea
                            {...register("address")}
                            placeholder="Address"
                            className="input"
                        />

                        <input
                            {...register("preferredLanguage")}
                            placeholder="Preferred Language"
                            className="input md:w-1/2"
                        />

                    </section>

                    {/* EMERGENCY */}
                    <section className="bg-white p-6 rounded-xl shadow space-y-4">

                        <div className="flex items-center gap-2 font-semibold">
                            <HeartIcon size={18} />
                            Emergency Contact
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                {...register("emergencyContactName")}
                                placeholder="Contact Name"
                                className="input"
                            />

                            <input
                                {...register("emergencyContactRelationship")}
                                placeholder="Relationship"
                                className="input"
                            />

                        </div>

                    </section>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Submit Registration
                    </button>

                </form>

            </div>
        </div>
    );
}