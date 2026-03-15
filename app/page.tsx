"use client";

import Link from "next/link";
import { HeartIcon, MonitorIcon } from "lucide-react";
import { Button } from "antd";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow">

        <h1 className="text-2xl font-semibold text-center mb-6">
          MediCare Demo
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Select a role to start the demo
        </p>

        <div className="space-y-4 gap-2 flex flex-col">

          <Link href="/patient">
            <Button className="w-full flex items-center gap-2">
              <HeartIcon className="w-4 h-4"/>
              Patient Registration
            </Button>
          </Link>

          <Link href="/staff">
            <Button className="w-full flex items-center gap-2">
              <MonitorIcon className="w-4 h-4"/>
              Staff Dashboard
            </Button>
          </Link>

        </div>

      </div>

    </div>
  );
}