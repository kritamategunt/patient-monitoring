"use client";

import { useEffect } from "react";
import { Input, Button, Select, Row, Col } from "antd";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { patientSchema } from "@/schemas/patientSchema";
import { PatientFormData } from "@/types/patient";
import { useSocket } from "@/context/SocketProvider";

import { UserIcon, PhoneIcon, MapPinIcon, HeartIcon } from "lucide-react";
import Swal from "sweetalert2";

const { TextArea } = Input;

export default function PatientForm() {

    const socket = useSocket();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            emergencyContacts: [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "emergencyContacts",
    });
    const values = watch();

    // realtime typing
    useEffect(() => {
        socket.emit("join", "patient")

        const timeout = setTimeout(() => {
            socket.emit("patientUpdate", values);
        }, 300);

        return () => clearTimeout(timeout);
    }, [values, socket]);

    const onSubmit = async (data: PatientFormData) => {
        if (!socket.connected) {
            console.log("Socket not connected");
            return;
        }
        console.log("Submitting...", data);
        socket.emit("submit", data);

        await Swal.fire({
            icon: "success",
            title: "Registration Complete",
            text: "Patient registration submitted successfully.",
            confirmButtonColor: "#2563eb",
        });

        reset();

        console.log("Form submitted:", data);
    };

    return (
        <div className="min-h-screen border-t-4 border-teal-300 py-10">
            <div className="max-w-4xl mx-auto p-6">

                <form
                    onSubmit={handleSubmit(
                        onSubmit,
                        (errors) => {
                            console.log("Validation errors:", errors);
                        }
                    )}
                >
                    {/* PERSONAL INFO */}
                    <section className="bg-white p-6 rounded-xl shadow mb-8">

                        <div className="flex items-center gap-2 font-semibold mb-4">
                            <UserIcon size={18} />
                            Personal Information
                        </div>

                        <Row gutter={16}>

                            <Col span={8}>
                                <h1>First Name</h1>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="First Name"
                                            required
                                            status={errors.firstName ? "error" : ""} />
                                    )}
                                />
                                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                            </Col>

                            <Col span={8}>
                                <h1>Middle Name</h1>
                                <Controller
                                    name="middleName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Middle Name" />
                                    )}
                                />
                            </Col>

                            <Col span={8}>
                                <h1>Last Name</h1>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} status={errors.lastName ? "error" : ""}
                                            placeholder="Last Name" required />
                                    )}
                                />
                                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                            </Col>

                        </Row>

                        <Row gutter={16} className="mt-4">
                            <Col span={12}>
                                <h1>Date of Birth</h1>
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    render={({ field }) => (
                                        <Input type="date" {...field} required status={errors.dateOfBirth ? "error" : ""} />
                                    )}
                                />
                            </Col>

                            <Col span={12}>
                                <h1>Gender</h1>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            title="gender"
                                            placeholder="Select Gender"
                                            status={errors.gender ? "error" : ""}
                                            options={[
                                                { value: "Male", label: "Male" },
                                                { value: "Female", label: "Female" },
                                                { value: "Prefer not to say", label: "Prefer not to say" },
                                            ]}
                                        />


                                    )}
                                />
                                {errors.gender && (
                                    <p className="text-red-500 text-sm">{errors.gender.message && 'field is require'}</p>
                                )}
                            </Col>
                        </Row>

                        <Row gutter={16} className="mt-4">
                            <Col span={12}>
                                <h1>Nationality</h1>
                                <Controller
                                    name="nationality"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            title="nationality"
                                            placeholder="Select Nationality"
                                            options={[
                                                { value: "American", label: "American" },
                                                { value: "Canadian", label: "Canadian" },
                                                { value: "British", label: "British" },
                                                { value: "Australian", label: "Australian" },
                                                { value: "Indian", label: "Indian" },
                                                { value: "Thai", label: "Thai" },
                                                { value: "Other", label: "Other" },
                                            ]}
                                        />
                                    )}
                                />
                                {errors.nationality && (
                                    <p className="text-red-500 text-sm">{errors.nationality?.message && 'field is require'}</p>
                                )}
                            </Col>

                            <Col span={12}>
                                <h1>Preferred Language</h1>
                                <Controller
                                    name="preferredLanguage"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            title="preferredLanguage"
                                            placeholder="Select Preferred Language"
                                            status={errors.preferredLanguage ? "error" : ""}
                                            options={[
                                                { value: "English", label: "English" },
                                                { value: "Spanish", label: "Spanish" },
                                                { value: "French", label: "French" },
                                                { value: "Chinese", label: "Chinese" },
                                                { value: "Thai", label: "Thai" },
                                                { value: "Other", label: "Other" },
                                            ]}
                                        />
                                    )}

                                />
                                {errors.preferredLanguage && (
                                    <p className="text-red-500 text-sm">{errors.preferredLanguage?.message && 'field is require'}</p>
                                )}
                            </Col>

                        </Row>
                    </section>

                    {/* CONTACT */}
                    <section className="bg-white p-6 rounded-xl shadow mb-8">

                        <div className="flex items-center gap-2 font-semibold mb-4">
                            <PhoneIcon size={18} />
                            Contact Details
                        </div>

                        <Row gutter={16}>

                            <Col span={12}>
                                <h1>Phone Number</h1>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Phone Number" />
                                    )}
                                />
                            </Col>

                            <Col span={12}>
                                <h1>Email</h1>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Email" />
                                    )}
                                />
                            </Col>

                        </Row>

                    </section>

                    {/* ADDRESS */}
                    <section className="bg-white p-6 rounded-xl shadow mb-8">

                        <div className="flex items-center gap-2 font-semibold mb-4">
                            <MapPinIcon size={18} />
                            Address
                        </div>

                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <TextArea {...field} rows={3} placeholder="Address" />
                            )}
                        />

                    </section>

                    {/* EMERGENCY */}
                    {/* EMERGENCY */}
                    <section className="bg-white p-6 rounded-xl shadow mb-8">

                        <div className="flex items-center justify-between mb-4">

                            <div className="flex items-center gap-2 font-semibold">
                                <HeartIcon size={18} />
                                Emergency Contacts
                            </div>

                            <Button
                                type="dashed"
                                onClick={() => append({ name: "", relationship: "" })}
                            >
                                + Add Contact
                            </Button>

                        </div>

                        {fields.length === 0 && (
                            <p className="text-gray-400 text-sm mb-2">
                                No emergency contacts added
                            </p>
                        )}

                        {fields.map((item, index) => (
                            <Row gutter={16} key={item.id} className="mb-3">
                                <Col span={10}>
                                    <h1>Name</h1>
                                    <Controller
                                        name={`emergencyContacts.${index}.name`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Contact Name" />
                                        )}
                                    />
                                </Col>

                                <Col span={10}>
                                    <h1>Relationship</h1>
                                    <Controller
                                        name={`emergencyContacts.${index}.relationship`}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Relationship"
                                                options={[
                                                    { value: "Parent", label: "Parent" },
                                                    { value: "Sibling", label: "Sibling" },
                                                    { value: "Spouse", label: "Spouse" },
                                                    { value: "Friend", label: "Friend" },
                                                    { value: "Other", label: "Other" },
                                                ]}
                                            />
                                        )}
                                    />
                                </Col>

                                <Col span={4} className="flex items-center">
                                    <br />
                                    <Button danger onClick={() => remove(index)}>
                                        Remove
                                    </Button>
                                </Col>

                            </Row>
                        ))}

                    </section>

                    <Button type="primary" htmlType="submit" size="large">
                        Submit Registration
                    </Button>

                </form>

            </div>
        </div>
    );
}