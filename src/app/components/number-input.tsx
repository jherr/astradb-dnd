import { useState } from "react";

import { Input } from "@/components/ui/input";

export function NumberInput({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className: string;
}) {
  const [localValue, setLocalValue] = useState(value.toString());

  return (
    <Input
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      onBlur={() => {
        onChange(+localValue);
      }}
      className={className}
    />
  );
}
