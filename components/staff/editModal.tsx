"use client"

import { Modal, Form, Input, Select, Button } from "antd"
import { SubmittedPatient } from "./StaffDashboard"
import { useEffect } from "react"



interface Props {
    open: boolean
    patient: SubmittedPatient | null
    onCancel: () => void
    onSave: (values: SubmittedPatient) => void
}

export default function EditPatientModal({
    open,
    patient,
    onCancel,
    onSave,
}: Props) {
    const [form] = Form.useForm()

    useEffect(() => {
        form.resetFields()
        if (patient) {
            form.setFieldsValue(patient)
        }
    }, [patient, form])

    return (
        <Modal
            title="Edit Patient"
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={patient || undefined}
                onFinish={onSave}
            >
                <Form.Item name="firstName" label="First Name">
                    <Input />
                </Form.Item>

                <Form.Item name="lastName" label="Last Name">
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email">
                    <Input />
                </Form.Item>

                <Form.Item name="phoneNumber" label="Phone">
                    <Input />
                </Form.Item>

                <Form.Item name="gender" label="Gender">
                    <Select
                        options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Prefer not to say", label: "Prefer not to say" },
                        ]}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}