import { UseFormRegister } from "react-hook-form";

interface Props {
  label: string
  name: string
  register: UseFormRegister<any>
  type?: string
}

export default function InputField({
  label,
  name,
  register,
  type = "text"
}: Props) {

  return (
    <div className="flex flex-col gap-1">

      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        {...register(name)}
        className="border rounded p-2"
      />

    </div>
  );
}