import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Character } from "../types";
import { DECENT_TEAM, GREAT_TEAM, BADASS_TEAM } from "../teams";

import { NumberInput } from "./number-input";

import { useAdventureBuilder } from "./adventure-builder-store";

const CharacterEditor = ({
  character,
  onChangeName,
  onChangStat,
}: {
  character: Character;
  onChangeName: (name: string) => void;
  onChangStat: (stat: string, value: number) => void;
}) => {
  const fields = [
    "hit_points",
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        value={character.name}
        onChange={(e) => {
          onChangeName(e.target.value);
        }}
        className="w-full @lg:w-[20%] text-xs @lg:text-lg"
      />
      {fields.map((field) => (
        <NumberInput
          key={field}
          value={character[field as keyof Character] as unknown as number}
          onChange={(v) => {
            onChangStat(field, v);
          }}
          className="w-[12%] @lg:w-[10%] px-1 @lg:px-4"
        />
      ))}
    </div>
  );
};

export function PartyEditor() {
  const party = useAdventureBuilder((s) => s.party);
  const setParty = useAdventureBuilder((s) => s.setParty);
  const setCharacterName = useAdventureBuilder((s) => s.setCharacterName);
  const setCharacterStat = useAdventureBuilder((s) => s.setCharacterStat);

  return (
    <>
      <div className="@container">
        <div className="flex flex-col @lg:flex-row @lg:justify-between @lg:items-center @lg:mb-5">
          <h1 className="text-2xl font-bold border-b-gray-400">
            Your Adventurers
          </h1>
          <div className="flex gap-2 mb-5 @lg:mb-0">
            <Button onClick={() => setParty(DECENT_TEAM)} size="sm">
              Decent
            </Button>
            <Button onClick={() => setParty(GREAT_TEAM)} size="sm">
              Great
            </Button>
            <Button onClick={() => setParty(BADASS_TEAM)} size="sm">
              Badass
            </Button>
          </div>
        </div>
      </div>
      <div className="@container flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 border-b-gray-300">
          <div className="w-full @lg:w-[20%] @lg:text-center text-xs @lg:text-lg">
            Name
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            HP
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            STR
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            DEX
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            CON
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            INT
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            WIS
          </div>
          <div className="w-[12%] @lg:w-[10%] @lg:text-center text-xs @lg:text-lg">
            CHR
          </div>
        </div>
        {party.map((character, index) => {
          return (
            <CharacterEditor
              character={character}
              key={character.name}
              onChangeName={(name) => {
                setCharacterName(index, name);
              }}
              onChangStat={(stat, value) => {
                setCharacterStat(index, stat as keyof Character, value);
              }}
            />
          );
        })}
      </div>
    </>
  );
}
