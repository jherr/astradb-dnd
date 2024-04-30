"use client";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import Loading from "./loading";

import { Character } from "../types";

import MonsterTable from "./monster-table";
import SettingSelector from "./setting-selector";

import { getMonsters } from "../actions/getMonsters";
import { getAdventure } from "../actions/getAdventure";
import { getAdventurer } from "../actions/getAdventurer";
import { DECENT_TEAM, GREAT_TEAM, BADASS_TEAM } from "../teams";
import { SETTINGS } from "@/constants";

// https://www.dndbeyond.com/characters/120477786 - Lori
// https://www.dndbeyond.com/characters/120476827 - Jason

const CHARACTER_CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

function NumberInput({
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

const CharacterEditor = ({
  character,
  onChangeName,
  onChangStat,
}: {
  character: Character;
  onChangeName: (name: string) => void;
  onChangStat: (stat: string, value: number) => void;
}) => {
  return (
    <div className="flex gap-2">
      <Input
        value={character.name}
        onChange={(e) => {
          onChangeName(e.target.value);
        }}
        className="w-[30%]"
      />
      <NumberInput
        value={character.hit_points}
        onChange={(v) => {
          onChangStat("hit_points", v);
        }}
        className="w-[10%]"
      />
      <NumberInput
        value={character.strength}
        onChange={(v) => {
          onChangStat("strength", v);
        }}
        className="w-[10%]"
      />
      <NumberInput
        value={character.dexterity}
        onChange={(v) => {
          onChangStat("dexterity", v);
        }}
        className="w-[10%]"
      />
      <NumberInput
        value={character.constitution}
        onChange={(v) => {
          onChangStat("constitution", v);
        }}
        className="w-[10%]"
      />
      <NumberInput
        value={character.intelligence}
        onChange={(v) => {
          onChangStat("intelligence", v);
        }}
        className="w-[10%]"
      />
      <NumberInput
        value={character.wisdom}
        onChange={(v) => {
          onChangStat("wisdom", v);
        }}
        className="w-[10%]"
      />
      <NumberInput
        value={character.charisma}
        onChange={(v) => {
          onChangStat("charisma", v);
        }}
        className="w-[10%]"
      />
    </div>
  );
};

function roll3D6() {
  return (
    Math.floor(Math.random() * 6) +
    Math.floor(Math.random() * 6) +
    Math.floor(Math.random() * 6) +
    3
  );
}

export default function AdventureBuilder() {
  const [party, setParty] = useState<Character[]>(DECENT_TEAM);
  const [adventure, setAdventure] = useState<string | null>("");
  const [processing, setProcessing] = useState(false);
  const [difficulty, setDifficulty] = useState("1");
  const [url, setUrl] = useState<string>(
    "https://www.dndbeyond.com/characters/120476570"
  );
  const [monsters, setMonsters] = useState<Character[] | null>(null);
  const [setting, setSetting] = useState("dark-forest");

  const [speeds, setSpeeds] = useState<{
    vectorSearch: number | null;
    chatCompletion: number | null;
  }>({
    vectorSearch: null,
    chatCompletion: null,
  });

  return (
    <div className="flex gap-4">
      <div className="w-1/2 pr-2 pt-5 border-r-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold border-b-gray-400">
            Your Adventurers
          </h1>
          <div className="flex gap-2">
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
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 border-b-gray-300">
            <div className="w-[30%] text-center">Name</div>
            <div className="w-[10%] text-center">HP</div>
            <div className="w-[10%] text-center">STR</div>
            <div className="w-[10%] text-center">DEX</div>
            <div className="w-[10%] text-center">CON</div>
            <div className="w-[10%] text-center">INT</div>
            <div className="w-[10%] text-center">WIS</div>
            <div className="w-[10%] text-center">CHR</div>
          </div>
          {party.map((character, index) => {
            return (
              <CharacterEditor
                character={character}
                key={character.name}
                onChangeName={(name) => {
                  setParty((party) => {
                    const newParty = [...party];
                    newParty[index] = { ...newParty[index], name };
                    return newParty;
                  });
                }}
                onChangStat={(stat, value) => {
                  setParty((party) => {
                    const newParty = [...party];
                    newParty[index] = { ...newParty[index], [stat]: value };
                    return newParty;
                  });
                }}
              />
            );
          })}
        </div>

        <div className="flex flex-col xl:flex-row gap-2 mt-5 items-center">
          <div className="w-full xl:w-2/3 flex gap-2">
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
          <div className="w-full xl:w-1/3 flex justify-end gap-2">
            <Button
              onClick={() => {
                setParty([
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
            <Button
              onClick={() => {
                setParty([]);
              }}
              variant="destructive"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <h1 className="text-2xl font-bold mb-2">
            Where Do You Want to Adventure?
          </h1>
          <SettingSelector setting={setting} onSelect={(s) => setSetting(s)} />
          <div className="mt-5 flex gap-2 justify-center items-center">
            <Label>Difficulty</Label>
            <RadioGroup defaultValue={difficulty} className="flex gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="0.5"
                  id="option-easy"
                  onClick={() => {
                    setDifficulty("0.5");
                  }}
                />
                <Label htmlFor="option-easy">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="1"
                  id="option-normal"
                  onClick={() => {
                    setDifficulty("1");
                  }}
                />
                <Label htmlFor="option-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="1.5"
                  id="option-hard"
                  onClick={() => {
                    setDifficulty("1.5");
                  }}
                />
                <Label htmlFor="option-hard">Hard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="3"
                  id="option-insane"
                  onClick={() => {
                    setDifficulty("3");
                  }}
                />
                <Label htmlFor="option-insane">Insane</Label>
              </div>
            </RadioGroup>

            <Button
              onClick={async () => {
                setProcessing(true);

                setMonsters(null);
                setAdventure(null);

                setSpeeds({
                  vectorSearch: 0,
                  chatCompletion: 0,
                });

                const vStart = Date.now();
                const monsters = await getMonsters(party, +difficulty);
                setSpeeds((speeds) => ({
                  ...speeds,
                  vectorSearch: (Date.now() - vStart) / 1000.0,
                }));
                setMonsters(monsters);

                const aiStart = Date.now();
                setAdventure(
                  await getAdventure(party, monsters, SETTINGS[setting])
                );
                setSpeeds((speeds) => ({
                  ...speeds,
                  chatCompletion: (Date.now() - aiStart) / 1000.0,
                }));

                setProcessing(false);
              }}
              className="bg-green-800 text-white font-bold"
            >
              Go Adventuring!
            </Button>
          </div>
        </div>
      </div>

      <div className="w-1/2 pl-2 pt-2 h-screen">
        {processing ? (
          <div className="flex justify-center my-20">
            <Loading />
          </div>
        ) : null}

        {!processing && (speeds.vectorSearch || speeds.chatCompletion) ? (
          <div className="flex gap-2 text-xs items-center border-t-gray-400 border-b-gray-400 my-2 py-3">
            <div className="italic">Performce metrics:</div>
            {speeds.vectorSearch && (
              <div>Vector Search: {speeds.vectorSearch} seconds</div>
            )}
            {speeds.chatCompletion && (
              <div>AI: {speeds.chatCompletion} seconds</div>
            )}
          </div>
        ) : null}

        <div className="overflow-y-scroll h-[40%]">
          {adventure !== null
            ? adventure.split("\n").map((t, i) => (
                <p key={i} className="mb-5">
                  {t}
                </p>
              ))
            : null}
        </div>

        {monsters && (
          <div className="h-[40%] overflow-y-scroll border-t-slate-500 mt-3 pt-3">
            <h1 className="text-3xl font-bold">The Monsters</h1>
            <div className="mt-2">
              <MonsterTable monsters={monsters} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
