import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getAdventurer } from "../actions/getAdventurer";

import { useAdventureBuilder } from "./adventure-builder-store";

// https://www.dndbeyond.com/characters/120477786 - Lori
// https://www.dndbeyond.com/characters/120476827 - Jason

export function DnDBeyond() {
  const [url, setUrl] = useState<string>(
    "https://www.dndbeyond.com/characters/120476570"
  );

  const party = useAdventureBuilder((s) => s.party);
  const setParty = useAdventureBuilder((s) => s.setParty);

  return (
    <div className="flex gap-2">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-grow text-xs"
      />
      <Button
        onClick={async () => {
          const adventurer = await getAdventurer(url);
          if (adventurer) {
            setParty([...party, adventurer]);
          }
        }}
        size="sm"
      >
        From D&D Beyond
      </Button>
    </div>
  );
}
