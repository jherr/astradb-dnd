import { create } from "zustand";

import { Character } from "../types";
import { DECENT_TEAM } from "../teams";

import { getMonsters } from "../actions/getMonsters";
import { getAdventure } from "../actions/getAdventure";
import { SETTINGS } from "@/constants";

export const useAdventureBuilder = create<{
  party: Character[];
  setParty: (party: Character[]) => void;
  setCharacterName: (index: number, name: string) => void;
  setCharacterStat: (
    index: number,
    stat: Omit<keyof Character, "name">,
    value: number
  ) => void;
  adventure: string | null;
  difficulty: string;
  processing: boolean;
  setDifficulty: (difficulty: string) => void;
  monsters: Character[] | null;
  setting: string;
  setSetting: (setting: string) => void;
  speeds: {
    vectorSearch: number | null;
    chatCompletion: number | null;
  };
  createAdventure: () => Promise<void>;
}>((set, get) => ({
  party: DECENT_TEAM,
  adventure: "",
  processing: false,
  difficulty: "1",
  monsters: null,
  setting: "dark-forest",
  speeds: {
    vectorSearch: null,
    chatCompletion: null,
  },

  setParty: (party) => set({ party }),
  setCharacterName: (index, name) =>
    set((state) => {
      const party = state.party.slice();
      party[index].name = name;
      return { party };
    }),
  setCharacterStat: (index, stat, value) =>
    set((state) => {
      const party = state.party.slice();
      // @ts-ignore
      party[index][stat as keyof Character] = value;
      return { party };
    }),

  setDifficulty: (difficulty) => set({ difficulty }),
  setSetting: (setting) => set({ setting }),

  createAdventure: async () => {
    const { party, difficulty, setting } = get();

    set({
      processing: true,
      monsters: null,
      adventure: null,
      speeds: { vectorSearch: 0, chatCompletion: 0 },
    });

    const vStart = Date.now();
    const monsters = await getMonsters(party, +difficulty);
    set((state) => ({
      ...state,
      speeds: {
        ...state.speeds,
        vectorSearch: (Date.now() - vStart) / 1000.0,
      },
      monsters,
    }));

    const aiStart = Date.now();
    const adventure = await getAdventure(party, monsters, SETTINGS[setting]);
    set((state) => ({
      ...state,
      speeds: {
        ...state.speeds,
        chatCompletion: (Date.now() - aiStart) / 1000.0,
      },
      adventure,
      processing: false,
    }));
  },
}));
