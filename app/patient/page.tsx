import PatientForm from "@/components/form/PatientForm";

export default function Page() {

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Patient Registration
      </h1>

      <PatientForm />

    </div>
  );
}