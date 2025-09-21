import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TopBarProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

export default function TopBar({ filter, setFilter }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-col p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-headline">Home</h1>
      </div>
      <RadioGroup
        value={filter}
        onValueChange={setFilter}
        className="flex items-center space-x-4 mt-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="r1" />
          <Label htmlFor="r1">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="replied" id="r2" />
          <Label htmlFor="r2">Replied</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not-replied" id="r3" />
          <Label htmlFor="r3">Not Replied</Label>
        </div>
      </RadioGroup>
    </header>
  );
}
