"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import Loading from "./loading";

import { Character } from "../types";

import MonsterTable from "./monster-table";
import SettingSelector from "./setting-selector";

import { getMonsters } from "../actions/getMonsters";
import { getAdventure } from "../actions/getAdventure";
import { DECENT_TEAM } from "../teams";
import { SETTINGS } from "@/constants";

import { PartyEditor } from "./party-editor";
import { DnDBeyond } from "./dnd-beyond";
import { RandomAdventurer } from "./random-adventurer";
import { DifficultySelector } from "./difficulty-selector";

const useAdventureBuilder = () => {
  const [party, setParty] = useState<Character[]>(DECENT_TEAM);
  const [adventure, setAdventure] = useState<string | null>("");
  const [processing, setProcessing] = useState(false);
  const [difficulty, setDifficulty] = useState("1");
  const [monsters, setMonsters] = useState<Character[] | null>(null);
  const [setting, setSetting] = useState("dark-forest");

  const [speeds, setSpeeds] = useState<{
    vectorSearch: number | null;
    chatCompletion: number | null;
  }>({
    vectorSearch: null,
    chatCompletion: null,
  });

  async function onAdventure() {
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
    setAdventure(await getAdventure(party, monsters, SETTINGS[setting]));
    setSpeeds((speeds) => ({
      ...speeds,
      chatCompletion: (Date.now() - aiStart) / 1000.0,
    }));

    setProcessing(false);
  }

  return {
    party,
    setParty,
    adventure,
    difficulty,
    processing,
    setDifficulty,
    monsters,
    setMonsters,
    setting,
    setSetting,
    speeds,
    onAdventure,
  };
};

export default function AdventureBuilder() {
  const {
    party,
    setParty,
    adventure,
    difficulty,
    processing,
    setDifficulty,
    monsters,
    setting,
    setSetting,
    speeds,
    onAdventure,
  } = useAdventureBuilder();

  return (
    <div className="@container flex gap-4">
      <div className="w-full @lg:w-1/2 pr-2 pt-5 @lg:border-r-2">
        <PartyEditor party={party} setParty={setParty} />

        <div className="flex flex-col @xl:flex-row gap-2 mt-5 @xl:items-center @xl:justify-between">
          <div className="">
            <DnDBeyond setParty={setParty} />
          </div>
          <div className="flex gap-2">
            <RandomAdventurer setParty={setParty} />
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
            <DifficultySelector
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />

            <Button
              onClick={onAdventure}
              className="bg-green-800 text-white font-bold"
            >
              Go Adventuring!
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full @lg:w-1/2 pl-2 pt-2 h-screen">
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
