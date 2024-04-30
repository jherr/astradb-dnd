import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { useAdventureBuilder } from "./adventure-builder-store";

export function DifficultySelector() {
  const difficulty = useAdventureBuilder((s) => s.difficulty);
  const setDifficulty = useAdventureBuilder((s) => s.setDifficulty);

  return (
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
  );
}
