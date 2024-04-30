"use server";

import { Character } from "../types";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAdventure(
  party: Character[],
  monsters: Character[],
  setting: string = "dark forest"
): Promise<string> {
  let content = `You are a dungeon master that is desiging a random encounter for a small group of adventurers.
    The names of your adventurers are ${party
      .map((character) => character.name)
      .join(
        ", "
      )}. Generate a potential random encounter in a ${setting} for them to go on that includes any of the 
    following monsters: ${monsters
      .map((character) => character.name)
      .join(
        ", "
      )}. Provide a two paragraph explanation of the encounter. Provide a short explanation of the 
      goal. Provide a short explanation of the reward. Provide a short explanation of the consequences.
      
      Provide the result in the format:
      Encounter: [Name of Encounter]
      Goal: [Goal of Encounter]
      Reward: [Reward of Encounter]
      Consequences: [Consequences of Encounter]`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [{ role: "system", content }],
  });

  return response.choices[0].message.content ?? "";
}
