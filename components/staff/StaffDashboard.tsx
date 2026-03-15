"use client"

import { useSocket } from "@/context/SocketProvider"
import { Table, Tag, Tooltip, Button } from "antd"
import type { ColumnsType } from "antd/es/table"
import {
    HeartIcon,
    UsersIcon,
    ClipboardCheckIcon,
    MonitorIcon,
    ArrowLeftIcon,
    RefreshCwIcon,
    CheckCircle2Icon,
} from "lucide-react"
import { useEffect, useState } from "react"
import EditPatientModal from "./editModal"

export interface SubmittedPatient {
    id: string
    firstName: string
    middleName?: string
    lastName: string
    email: string
    phoneNumber: string
    gender?: string
    preferredLanguage?: string
    submittedAt: string
    status?: "Submitted" | "Updating"
}

interface ActivePatient {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    startedAt: string
}
function StatCard({
    icon: Icon,
    label,
    value,
    color,
    bgColor,
    sub,
}: {
    icon: React.ElementType
    label: string
    value: number | string
    color: string
    bgColor: string
    sub?: string
}) {
    return (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {sub && (
                    <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground/70">
                        {sub}
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-foreground leading-none mb-1">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}



export default function StaffDashboard() {
    const socket = useSocket();

    const [activePatients, setActivePatients] = useState<ActivePatient[]>([]); const [now, setNow] = useState(new Date())
    const [submittedPatients, setSubmittedPatients] = useState<SubmittedPatient[]>([]);
    const [editingPatient, setEditingPatient] = useState<SubmittedPatient | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    // realtime update from socket
    useEffect(() => {
        if (!socket) return
        socket.emit("join", "staff")

        const handleUpdate = (payload: any) => {
            setActivePatients(payload.activePatients ?? [])
            setSubmittedPatients(payload.submittedPatients ?? [])
        }

        socket.on("update", handleUpdate)

        return () => {
            socket.off("update", handleUpdate)
        }
    }, [socket])

    // live clock refresh
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 10000);
        return () => clearInterval(t);
    }, []);

    function timeSince(iso?: string | Date) {
        if (!iso) return "just now"

        const time = new Date(iso).getTime()

        if (isNaN(time)) return "just now"

        const diff = Math.floor((Date.now() - time) / 1000)

        if (diff < 60) return `${diff}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        return `${Math.floor(diff / 3600)}h ago`
    }

    const openEdit = (patient: SubmittedPatient) => {
        setEditingPatient(patient)
        setIsModalOpen(true)
    }

    const closeEdit = () => {
        setEditingPatient(null)
        setIsModalOpen(false)
    }

    const handleSave = (values: Partial<SubmittedPatient>) => {
        if (!editingPatient) return

        const updatedPatient: SubmittedPatient = {
            ...editingPatient,
            ...values,
            status: "Updating",
        }

        setSubmittedPatients((prev) =>
            prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
        )

        socket.emit("editPatient", updatedPatient)

        closeEdit()
    }

    const submittedColumns: ColumnsType<SubmittedPatient> = [
        {
            title: "Patient ID",
            dataIndex: "id",
            key: "id",
            width: 140,
            render: (id: string) => (
                <span className="font-mono text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md font-medium">
                    {id}
                </span>
            ),
        },
        {
            title: "Patient Name",
            key: "name",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                        {record.firstName?.[0]?.toUpperCase() || "?"}{record.lastName?.[0]?.toUpperCase() || ""}
                    </div>
                    <div>
                        <p className="font-medium text-foreground text-sm">
                            {record.firstName} {record.middleName ? `${record.middleName} ` : ""}{record.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: "Contact",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            responsive: ["lg" as const],
            render: (phone: string) => (
                <span className="text-sm text-muted-foreground font-mono">{phone}</span>
            ),
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            responsive: ["md" as const],
            width: 100,
            render: (gender: string) => (
                <Tag
                    className="!border-0 !rounded-full !px-3 !py-0.5 !text-xs !font-medium"
                    color={gender === "Male" ? "cyan" : gender === "Female" ? "magenta" : "default"}
                >
                    {gender}
                </Tag>
            ),
        },
        {
            title: "Language",
            dataIndex: "preferredLanguage",
            key: "preferredLanguage",
            responsive: ["xl" as const],
            width: 110,
            render: (lang: string) => (
                <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md">
                    {lang}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (status: string) => {
                if (status === "Updating") {
                    return (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full">
                            Updating
                        </span>
                    )
                }

                return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2Icon className="w-3 h-3" />
                        Submitted
                    </span>
                )
            },
        },
        {
            title: "Submitted",
            dataIndex: "submittedAt",
            key: "submittedAt",
            width: 130,
            sorter: (a, b) =>
                new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
            defaultSortOrder: "descend",
            render: (date: string) => (
                <Tooltip title={new Date(date).toLocaleString()}>
                    <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                            {new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            {new Date(date).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </p>
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 120,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => openEdit(record)}
                    >
                        Edit
                    </Button>
                </div>
            ),
        }
    ]

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            {/* Header */}
            <header className="bg-card border-b border-teal-300 sticky top-0 z-10 bg-teal-300/50 backdrop-blur-sm rounded-b-2xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <HeartIcon className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold text-foreground">MediCare Portal</h1>
                            <p className="text-xs text-muted-foreground">Staff Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">

                        <Button type="default" size="small" className="flex items-center gap-1" href="/patient">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Registration Form
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

                {/* Page title */}
                <div>
                    <h2 className="text-3xl font-semibold text-foreground text-balance mb-1">
                        Patient Overview
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Real-time monitor of active form sessions and submitted patient registrations.
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={MonitorIcon}
                        label="Active Sessions"
                        value={activePatients.length}
                        color="bg-blue-50 text-blue-600"
                        sub="Currently filling form" bgColor={""} />
                    <StatCard
                        icon={ClipboardCheckIcon}
                        label="Total Submitted"
                        value={Array.isArray(submittedPatients) ? submittedPatients.length : 0}
                        color="bg-green-50 text-green-600"
                        sub="All time registrations" bgColor={""} />
                    <StatCard
                        icon={UsersIcon}
                        label="Today's Registrations"
                        value={(Array.isArray(submittedPatients) ? submittedPatients : []).filter(
                            (p: { submittedAt: string | number | Date }) => new Date(p.submittedAt).toDateString() === new Date().toDateString()
                        ).length ?? 0}
                        color="bg-teal-50 text-teal-600"
                        sub={new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })} bgColor={""} />
                    <StatCard
                        icon={RefreshCwIcon}
                        label="Last Updated"
                        value={now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        color="bg-slate-100 text-slate-600"
                        sub="Auto-refreshes every 10s" bgColor={""} />
                </div>

                {/* Active Patients */}
                <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                <MonitorIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Active Form Sessions</h3>
                                <p className="text-xs text-muted-foreground">Patients currently filling out the registration form</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                            {activePatients.length} active
                        </span>
                    </div>

                    {activePatients.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <MonitorIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No patients currently filling the form</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {activePatients.map((patient: ActivePatient) => (
                                <div
                                    key={patient.id}
                                    className="flex flex-wrap items-center justify-between gap-3 border border-border rounded-xl px-4 py-3 bg-background"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-accent-foreground select-none">
                                            {patient.firstName ? patient.firstName[0].toUpperCase() : "?"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {patient.firstName || patient.lastName
                                                    ? `${patient.firstName} ${patient.lastName}`.trim()
                                                    : "Filling form…"}
                                            </p>
                                            {patient.email && (
                                                <p className="text-xs text-muted-foreground">{patient.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                                            {patient.id}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {timeSince(patient.startedAt)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                            Typing
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Submitted Patients Table */}
                <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                                <ClipboardCheckIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Submitted Registrations</h3>
                                <p className="text-xs text-muted-foreground">All completed patient registrations</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                            {Array.isArray(submittedPatients) ? submittedPatients.length : 0} total
                        </span>
                    </div>

                    <Table<SubmittedPatient>
                        columns={submittedColumns}
                        dataSource={Array.isArray(submittedPatients) ? submittedPatients : []}
                        rowKey="id"
                        size="small"
                        scroll={{ x: 700 }}
                        locale={{
                            emptyText: (
                                <div className="py-10 text-muted-foreground text-center">
                                    <ClipboardCheckIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No submissions yet</p>
                                </div>
                            ),
                        }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `${total} patient${total !== 1 ? "s" : ""}`,
                        }}
                    />
                    <EditPatientModal
                        open={isModalOpen}
                        patient={editingPatient}
                        onCancel={closeEdit}
                        onSave={handleSave}
                    />
                </section>
            </main>
        </div>
    )
}
