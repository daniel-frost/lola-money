import { Card } from "@/components/ui/card";

// Temporary token smoke-test — confirms the Lola design tokens load.
// Replace with the real first screen.
const hues = [
  { name: "Blue · action", wash: "bg-blue-wash", bold: "bg-blue-bold" },
  { name: "Yellow · focus", wash: "bg-yellow-wash", bold: "bg-yellow-bold" },
  { name: "Green · paid", wash: "bg-green-wash", bold: "bg-green-bold" },
  { name: "Coral · overdue", wash: "bg-coral-wash", bold: "bg-coral-bold" },
  { name: "Purple · Lola", wash: "bg-purple-wash", bold: "bg-purple-bold" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 p-8">
      <h1 className="font-display text-[32px] font-black leading-tight tracking-display text-ink">
        Design tokens are{" "}
        <span className="bg-yellow-wash px-1 text-yellow-bold">live</span>.
      </h1>

      <Card className="flex flex-col gap-4">
        {hues.map((h) => (
          <div key={h.name} className="flex items-center gap-3">
            <span className={`h-8 w-8 rounded-pill ${h.wash}`} />
            <span className={`h-8 w-8 rounded-pill ${h.bold}`} />
            <span className="text-ink">{h.name}</span>
          </div>
        ))}
      </Card>

      <p className="text-sm text-muted">
        Temporary token preview — replace with the real first screen.
      </p>
    </main>
  );
}
