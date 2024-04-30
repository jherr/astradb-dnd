import { Button } from "@/components/ui/button";

import { Character } from "../types";
import { CHARACTER_CLASSES } from "@/constants";

function roll3D6() {
  return (
    Math.floor(Math.random() * 6) +
    Math.floor(Math.random() * 6) +
    Math.floor(Math.random() * 6) +
    3
  );
}

export function RandomAdventurer({
  setParty,
}: {
  setParty: React.Dispatch<React.SetStateAction<Character[]>>;
}) {
  return (
    <Button
      onClick={() => {
        setParty((party) => [
          ...party,
          {
            name: CHARACTER_CLASSES[
              Math.floor(Math.random() * CHARACTER_CLASSES.length)
            ],
            hit_points: Math.floor(Math.random() * 8) + 5,
            strength: roll3D6(),
            dexterity: roll3D6(),
            constitution: roll3D6(),
            intelligence: roll3D6(),
            wisdom: roll3D6(),
            charisma: roll3D6(),
          },
        ]);
      }}
    >
      Add Random
    </Button>
  );
}
