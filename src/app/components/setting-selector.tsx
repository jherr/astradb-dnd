import Image from "next/image";

import { SETTINGS } from "@/constants";

function Setting({
  setting,
  onClick,
  active,
}: {
  setting: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      className={`flex min-w-28 items-center flex-col gap-2 p-2 rounded-lg ${
        active ? "bg-gray-800" : ""
      }`}
      onClick={onClick}
    >
      <Image
        src={`/settings/${setting}.png`}
        alt={SETTINGS[setting]}
        width="1024"
        height="1024"
      />
      <span className="font-bold text-xs">{SETTINGS[setting]}</span>
    </button>
  );
}

export default function SettingSelector({
  setting,
  onSelect,
}: {
  setting: string;
  onSelect: (setting: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-scroll">
      {Object.keys(SETTINGS).map((key) => (
        <Setting
          setting={key}
          onClick={() => onSelect(key)}
          key={key}
          active={setting === key}
        />
      ))}
    </div>
  );
}
