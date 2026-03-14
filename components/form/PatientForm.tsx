"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { patientSchema } from "@/schemas/patientSchema";
import { PatientFormData } from "@/types/patient";

import { useSocket } from "@/context/SocketProvider";
import InputField from "./inputField";

export default function PatientForm() {

    const socket = useSocket();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            address: "",
            nationality: "",
            preferredLanguage: "",
            gender: "",
            religion: ""
        }
    });

    const values = watch();

    // Send realtime typing updates
    useEffect(() => {

        const handler = setTimeout(() => {
            socket.emit("patientUpdate", values);
        }, 300); // debounce typing

        return () => clearTimeout(handler);

    }, [values, socket]);


    console.log("patient typing", values);
    const onSubmit = (data: PatientFormData) => {

        socket.emit("submit", data);

    };



    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

            <InputField
                label="First Name"
                name="firstName"
                register={register}
            />

            <InputField
                label="Middle Name"
                name="middleName"
                register={register}
            />

            <InputField
                label="Last Name"
                name="lastName"
                register={register}
            />

            <InputField
                label="Date of Birth"
                name="dateOfBirth"
                register={register}
                type="date"
            />

            <InputField
                label="Gender"
                name="gender"
                register={register}
            />

            <InputField
                label="Phone Number"
                name="phoneNumber"
                register={register}
            />

            <InputField
                label="Email"
                name="email"
                register={register}
            />

            <InputField
                label="Address"
                name="address"
                register={register}
            />

            <InputField
                label="Preferred Language"
                name="preferredLanguage"
                register={register}
            />

            <InputField
                label="Nationality"
                name="nationality"
                register={register}
            />

            <InputField
                label="Emergency Contact"
                name="emergencyContactName"
                register={register}
            />

            <InputField
                label="Relationship"
                name="emergencyContactRelationship"
                register={register}
            />

            <InputField
                label="Religion"
                name="religion"
                register={register}
            />

            <button
                type="submit"
                className="col-span-1 md:col-span-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
            >
                Submit
            </button>

        </form>
    );
}