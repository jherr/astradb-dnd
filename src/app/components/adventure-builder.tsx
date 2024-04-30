"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import Loading from "./loading";

import MonsterTable from "./monster-table";
import SettingSelector from "./setting-selector";

import { PartyEditor } from "./party-editor";
import { DnDBeyond } from "./dnd-beyond";
import { RandomAdventurer } from "./random-adventurer";
import { DifficultySelector } from "./difficulty-selector";

import { useAdventureBuilder } from "./adventure-builder-store";

function ClearAllButton() {
  const setParty = useAdventureBuilder((s) => s.setParty);
  return (
    <Button
      onClick={() => {
        setParty([]);
      }}
      variant="destructive"
    >
      Clear All
    </Button>
  );
}

function CreateAdventureButton() {
  const createAdventure = useAdventureBuilder((s) => s.createAdventure);

  return (
    <Button
      onClick={createAdventure}
      className="bg-green-800 text-white font-bold"
    >
      Go Adventuring!
    </Button>
  );
}

function LoadingAnimation() {
  const processing = useAdventureBuilder((s) => s.processing);
  return processing ? (
    <div className="flex justify-center my-20">
      <Loading />
    </div>
  ) : null;
}

function PerformanceReadout() {
  const processing = useAdventureBuilder((s) => s.processing);
  const speeds = useAdventureBuilder((s) => s.speeds);

  return !processing && (speeds.vectorSearch || speeds.chatCompletion) ? (
    <div className="flex gap-2 text-xs items-center border-t-gray-400 border-b-gray-400 my-2 py-3">
      <div className="italic">Performce metrics:</div>
      {speeds.vectorSearch && (
        <div>Vector Search: {speeds.vectorSearch} seconds</div>
      )}
      {speeds.chatCompletion && <div>AI: {speeds.chatCompletion} seconds</div>}
    </div>
  ) : null;
}

function AdventureText() {
  const adventure = useAdventureBuilder((s) => s.adventure);

  return (
    <div className="overflow-y-scroll h-[40%]">
      {adventure !== null
        ? adventure.split("\n").map((t, i) => (
            <p key={i} className="mb-5">
              {t}
            </p>
          ))
        : null}
    </div>
  );
}

function MonsterTableSection() {
  const monsters = useAdventureBuilder((s) => s.monsters);

  return (
    monsters && (
      <div className="h-[40%] overflow-y-scroll border-t-slate-500 mt-3 pt-3">
        <h1 className="text-3xl font-bold">The Monsters</h1>
        <div className="mt-2">
          <MonsterTable monsters={monsters} />
        </div>
      </div>
    )
  );
}

export default function AdventureBuilder() {
  return (
    <div className="@container flex gap-4">
      <div className="w-full @lg:w-1/2 pr-2 pt-5 @lg:border-r-2">
        <PartyEditor />

        <div className="flex flex-col @xl:flex-row gap-2 mt-5 @xl:items-center @xl:justify-between">
          <div className="">
            <DnDBeyond />
          </div>
          <div className="flex gap-2">
            <RandomAdventurer />
            <ClearAllButton />
          </div>
        </div>

        <div className="mt-10">
          <h1 className="text-2xl font-bold mb-2">
            Where Do You Want to Adventure?
          </h1>
          <SettingSelector />
          <div className="mt-5 flex gap-2 justify-center items-center">
            <Label>Difficulty</Label>
            <DifficultySelector />

            <CreateAdventureButton />
          </div>
        </div>
      </div>

      <div className="w-full @lg:w-1/2 pl-2 pt-2 h-screen">
        <LoadingAnimation />
        <PerformanceReadout />
        <AdventureText />
        <MonsterTableSection />
      </div>
    </div>
  );
}
