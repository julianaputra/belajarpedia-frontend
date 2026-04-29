import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Label } from "@/components/ui/Input";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-surface-soft)] py-12 px-6">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Hero */}
        <header className="text-center animate-[var(--animate-fade-up)]">
          <Badge tone="sun" className="mb-4">
            Design System Preview
          </Badge>
          <h1 className="text-4xl sm:text-5xl mb-3">
            Belajarpedia <span className="text-brand-500">Direktori</span>{" "}
            Pendidikan Indonesia
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Sekolah, Universitas, dan Kursus dalam satu tempat. Cari yang paling
            cocok untuk kamu — gratis dan tanpa iklan ribet.
          </p>
        </header>

        {/* Color tokens */}
        <Section title="Brand Colors">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Swatch name="primary" hex="#10AF13" cls="bg-brand-500" textLight />
            <Swatch name="secondary" hex="#1C2F70" cls="bg-ink-700" textLight />
            <Swatch name="text body" hex="#212529" cls="bg-[#212529]" textLight />
            <Swatch name="surface" hex="#FFFFFF" cls="bg-white border-ink-200 border" />
          </div>
        </Section>

        {/* 3D Buttons */}
        <Section title="3D Buttons — coba klik!">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-end">
              <Button variant="primary" size="lg">Daftar Sekarang</Button>
              <Button variant="secondary" size="lg">Lihat Detail</Button>
              <Button variant="sun" size="lg">Featured!</Button>
              <Button variant="outline" size="lg">Pelajari</Button>
              <Button variant="ghost" size="lg">Skip</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              <Button size="md">Medium</Button>
              <Button size="sm">Small</Button>
              <Button disabled>Disabled</Button>
              <ButtonLink href="#" variant="primary">As Link</ButtonLink>
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards — hover untuk lift effect">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: "SMP Negeri 2 Kuta Utara", region: "Kab. Badung, Bali", tone: "brand" as const },
              { name: "Universitas Udayana", region: "Kota Denpasar, Bali", tone: "ink" as const },
              { name: "Timedoor Academy", region: "Kota Denpasar, Bali", tone: "sun" as const, featured: true },
            ].map((f, i) => (
              <Card key={i} interactive>
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-200 to-ink-200 rounded-t-[var(--radius-lg)]" />
                <CardHeader className="flex items-start justify-between gap-2">
                  <CardTitle>{f.name}</CardTitle>
                  {f.featured && <Badge tone="sun">⭐ Featured</Badge>}
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-muted">{f.region}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Section>

        {/* Form sample */}
        <Section title="Form elements">
          <Card>
            <CardBody className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="kamu@email.com" />
              </div>
              <div>
                <Label htmlFor="search">Cari sekolah atau kursus</Label>
                <Input id="search" placeholder="Contoh: Coding di Denpasar" />
              </div>
              <Button>Kirim</Button>
            </CardBody>
          </Card>
        </Section>

        {/* Animations */}
        <Section title="Animations">
          <div className="grid sm:grid-cols-3 gap-4">
            <DemoBox label="bounce-in" anim="bounce-in" />
            <DemoBox label="fade-up" anim="fade-up" />
            <DemoBox label="float (loop)" anim="float" />
          </div>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="animate-[var(--animate-fade-up)]">
      <h2 className="text-2xl mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  cls,
  textLight = false,
}: {
  name: string;
  hex: string;
  cls: string;
  textLight?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius)] p-4 ${cls} ${
        textLight ? "text-white" : "text-ink-800"
      }`}
    >
      <div className="font-semibold capitalize">{name}</div>
      <div className="text-xs opacity-80 font-mono">{hex}</div>
    </div>
  );
}

function DemoBox({ label, anim }: { label: string; anim: string }) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-white border-2 border-ink-100 p-6 text-center font-semibold text-ink-700 animate-[var(--animate-${anim})]`}
    >
      {label}
    </div>
  );
}
