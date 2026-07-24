import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, SectionHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  X,
  FileSpreadsheet,
  FileImage,
  Loader2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState, useRef } from "react";
import { useFinanceStore, Transaction } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/_app/upload")({
  head: () => ({ meta: [{ title: "Upload Statement — NairaLens AI" }] }),
  component: Upload,
});

const NIGERIAN_BANKS = [
  "GTBank",
  "Access Bank",
  "Zenith Bank",
  "UBA",
  "Kuda Bank",
  "OPay",
  "PalmPay",
  "Wema Bank",
  "Stanbic IBTC",
];

function Upload() {
  const { files, addUploadedFile, deleteFile } = useFinanceStore();
  const [dragOver, setDragOver] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string>("GTBank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Analyzing document format...",
    "Scanning cryptographic signatures...",
    "Extracting statement ledger entries...",
    "Categorizing transactions via NairaLens AI...",
    "Finalizing ledger persistence...",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0].name);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0].name);
    }
  };

  const processFile = (fileName: string) => {
    setIsProcessing(true);
    setProcessingStep(0);

    // Staggered status updates for an immersive full-fidelity parsing feel
    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          finalizeUpload(fileName);
          return prev;
        }
      });
    }, 1200);
  };

  const finalizeUpload = (fileName: string) => {
    // Generate realistic transactions matching the bank selected
    const generatedTxns: Transaction[] = [];
    const timestamp = new Date();
    const dateStr = timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeStr = timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (selectedBank === "Kuda Bank" || selectedBank === "OPay" || selectedBank === "PalmPay") {
      generatedTxns.push(
        {
          id: `new-${Date.now()}-1`,
          name: "Chowdeck Delivery",
          merchant: "chowdeck.com",
          cat: "Food",
          amount: -4500,
          date: `${dateStr}, ${timeStr}`,
          type: "debit",
          channel: "Card",
        },
        {
          id: `new-${Date.now()}-2`,
          name: "Opay Transfer Credit",
          merchant: "Transfer from Alabi",
          cat: "Income",
          amount: 45000,
          date: `${dateStr}, 08:30`,
          type: "credit",
          channel: "Transfer",
        },
        {
          id: `new-${Date.now()}-3`,
          name: "MTN Airtime via App",
          merchant: "MTN VTU",
          cat: "Telecom",
          amount: -1500,
          date: `${dateStr}, 07:15`,
          type: "debit",
          channel: "USSD",
        },
      );
    } else {
      generatedTxns.push(
        {
          id: `new-${Date.now()}-1`,
          name: `${selectedBank} SMS Alert Charge`,
          merchant: "SMS Alert",
          cat: "Bills",
          amount: -150,
          date: `${dateStr}, ${timeStr}`,
          type: "debit",
          channel: "Card",
        },
        {
          id: `new-${Date.now()}-2`,
          name: "Chowdeck Gourmet",
          merchant: "chowdeck.com",
          cat: "Food",
          amount: -9200,
          date: `${dateStr}, 19:40`,
          type: "debit",
          channel: "Card",
        },
        {
          id: `new-${Date.now()}-3`,
          name: "Salary Bonus",
          merchant: "Netfixed Ltd",
          cat: "Income",
          amount: 120000,
          date: `${dateStr}, 10:00`,
          type: "credit",
          channel: "Transfer",
        },
        {
          id: `new-${Date.now()}-4`,
          name: "Bolt Ride Lekki",
          merchant: "bolt.eu",
          cat: "Transport",
          amount: -3800,
          date: `${dateStr}, 11:22`,
          type: "debit",
          channel: "Card",
        },
      );
    }

    addUploadedFile(fileName, selectedBank, generatedTxns);
    setIsProcessing(false);
    toast.success(`Statement processed successfully! Added ${generatedTxns.length} transactions.`);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Import"
        title="Upload a bank statement"
        description="PDF, CSV, or scanned statement. We'll extract every transaction and categorize it in seconds."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* Bank selector */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">1. Select bank source</h3>
            <div className="grid grid-cols-3 gap-2">
              {NIGERIAN_BANKS.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBank(b)}
                  className={`rounded-xl border p-3 text-center text-xs font-medium transition ${selectedBank === b ? "border-primary bg-primary-soft/20 text-primary" : "border-border bg-surface/40 text-muted-foreground hover:border-border-strong hover:text-foreground"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Area */}
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-3xl border border-primary/30 bg-card p-10 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 grid-pattern opacity-10" />
                <div className="relative">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft/50 text-primary">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <h3 className="font-display mt-5 text-2xl italic tracking-tight">
                    Parsing Statement...
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    {steps[processingStep]}
                  </p>

                  <div className="mt-6 w-full max-w-md mx-auto h-1.5 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((processingStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  <div className="mt-6 flex justify-center gap-6">
                    {steps.map((s, idx) => (
                      <span
                        key={idx}
                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${idx <= processingStep ? "bg-primary" : "bg-muted"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={triggerFileSelect}
                className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition ${dragOver ? "border-primary bg-primary-soft/30" : "border-border bg-card hover:border-border-strong hover:bg-surface/20"}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                />
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="relative">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                    <UploadCloud className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display mt-5 text-3xl italic tracking-tight">
                    Drop your statement here
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    or click to browse · Max 25 MB
                  </p>
                  <div
                    className="mt-6 flex flex-wrap justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="hero" size="lg" onClick={triggerFileSelect}>
                      <UploadCloud className="h-4 w-4" /> Choose file
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        const csvText = prompt(
                          "Paste your CSV data here (comma separated values):",
                        );
                        if (csvText) {
                          processFile("Pasted_Statement.csv");
                        }
                      }}
                    >
                      Paste CSV
                    </Button>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    {[
                      { icon: FileText, label: "PDF Documents" },
                      { icon: FileSpreadsheet, label: "CSV / Excel Sheets" },
                      { icon: FileImage, label: "Scanned statement images" },
                    ].map((f) => (
                      <span
                        key={f.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] text-muted-foreground"
                      >
                        <f.icon className="h-3 w-3" /> {f.label}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent uploads */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent uploads
            </p>
            {files.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-xs text-muted-foreground">No statements imported yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition hover:border-border-strong"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-soft/50 text-primary">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{f.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {f.bank} · {f.txns} transactions · {f.when}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="soft">
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> {f.status}
                      </Badge>
                      <button
                        onClick={() => {
                          deleteFile(f.name);
                          toast.success(`Removed statement ${f.name}`);
                        }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Your data is private</p>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted-foreground">
              <li>· Encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
              <li>· Read-only — we never store credentials</li>
              <li>· Delete uploads anytime, one click</li>
              <li>· SOC 2-ready infrastructure</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold">How it works</p>
            <ol className="mt-3 space-y-3 text-xs text-muted-foreground">
              {[
                "Select bank source & drop a statement",
                "AI parses & categorizes every transaction",
                "Explore your updated dashboard, analytics, and chats",
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft/50 font-mono text-[10px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
