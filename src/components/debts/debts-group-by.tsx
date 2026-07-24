"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";

const GROUP_OPTIONS = [
  { value: "type", label: "Account type" },
  { value: "status", label: "Status" },
];

export function DebtsGroupBy() {
  const [value, setValue] = useState("type");
  return (
    <Select
      label="Group by"
      value={value}
      options={GROUP_OPTIONS}
      onChange={setValue}
    />
  );
}
