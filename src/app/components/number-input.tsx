import { useState, useMemo } from "react";

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

  useMemo(() => {
    setLocalValue(value.toString());
  }, [value]);

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
