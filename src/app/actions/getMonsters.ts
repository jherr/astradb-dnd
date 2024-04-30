"use server";
import { DataAPIClient } from "@datastax/astra-db-ts";

import { Character } from "../types";

export async function getMonsters(
  party: Character[],
  multiplier: number
): Promise<Character[]> {
  const client = new DataAPIClient(process.env.ASTRADB_CLIENT!);
  const db = client.db(process.env.ASTRADB_API!);

  const collection = await db.collection("monster_list");

  const sumVector = party.reduce(
    (acc, character) => {
      acc[0] += character.hit_points;
      acc[1] += character.strength;
      acc[2] += character.dexterity;
      acc[3] += character.constitution;
      acc[4] += character.intelligence;
      acc[5] += character.wisdom;
      acc[6] += character.charisma;
      return acc;
    },
    [0, 0, 0, 0, 0, 0, 0]
  );
  const averageVector = sumVector.map((v) => v / party.length);
  const scaledVector = averageVector.map((v) => v * multiplier);

  const cursor = collection.find(
    {},
    {
      vector: scaledVector,
      includeSimilarity: true,
      limit: 10,
    }
  );

  return cursor.toArray() as unknown as Character[];

  // const monsters = [];
  // for await (const doc of cursor) {
  //   monsters.push(doc);
  // }
  // return monsters as unknown as Character[];
}
