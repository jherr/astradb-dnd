import { DataAPIClient, VectorDoc } from "@datastax/astra-db-ts";
import fs from "node:fs";

interface Idea extends VectorDoc {
  idea: string;
}

const client = new DataAPIClient("*CLIENT_ID*");
const db = client.db("*API_ENDPOINT*");

(async () => {
  try {
    const monsterList = JSON.parse(fs.readFileSync("monsters.json", "utf-8"));

    const collection = await db.createCollection<Idea>("monster_list", {
      vector: {
        dimension: 7,
        metric: "euclidean",
      },
      checkExists: false,
    });

    const monsters = monsterList.map((m) => {
      return {
        ...m,
        $vector: [
          m.hit_points,
          m.strength,
          m.dexterity,
          m.constitution,
          m.intelligence,
          m.wisdom,
          m.charisma,
        ],
      };
    });
    await collection.insertMany(monsters);
  } finally {
    await client.close();
  }
})();
