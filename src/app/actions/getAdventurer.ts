"use server";

export async function getAdventurer(url: string) {
  const id = url.split("/").pop();
  const response = await fetch(
    `https://character-service.dndbeyond.com/character/v5/character/${id}`
  );
  const { data } = await response.json();
  return {
    name: data.name,
    hit_points: data.baseHitPoints,
    strength: data.stats[0].value,
    dexterity: data.stats[1].value,
    constitution: data.stats[2].value,
    intelligence: data.stats[3].value,
    wisdom: data.stats[4].value,
    charisma: data.stats[5].value,
  };
}
