import Image from "next/image";

import { SETTINGS } from "@/constants";

import { useAdventureBuilder } from "./adventure-builder-store";

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

export default function SettingSelector() {
  const setting = useAdventureBuilder((s) => s.setting);
  const setSetting = useAdventureBuilder((s) => s.setSetting);

  return (
    <div className="flex gap-2 overflow-x-scroll">
      {Object.keys(SETTINGS).map((key) => (
        <Setting
          setting={key}
          onClick={() => setSetting(key)}
          key={key}
          active={setting === key}
        />
      ))}
    </div>
  );
}
