import { createFileRoute, Link } from "@tanstack/react-router";
import { PageContainer, SectionHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
  Loader2,
  Wallet,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { getIconForCategory } from "@/lib/store";
import { useTransactions } from "@/hooks/use-transactions";
import { useStatements } from "@/hooks/use-statements";
import { toast } from "sonner";
import { motion } from "motion/react";

export const Route = createFileRoute("/_app/transactions")({
  head: () => ({ meta: [{ title: "Transactions — NairaLens AI" }] }),
  component: Transactions,
});

const CATEGORIES = [
  "All",
  "Food",
  "Transport",
  "Groceries",
  "Bills",
  "Income",
  "Housing",
  "Telecom",
  "Coffee",
];

function Transactions() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: txnsData, isLoading, refetch } = useTransactions({
    page: currentPage,
    size: itemsPerPage,
    category: selectedCat === "All" ? undefined : selectedCat,
    search: searchQuery.trim() || undefined,
  });

  const { data: statements, isLoading: isStatementsLoading } = useStatements();

  const hasCompleted = statements && statements.some(s => s.upload_status === "COMPLETED");
  const hasProcessing = statements && statements.some(s => 
    ["UPLOADED", "QUEUED", "PARSING", "NORMALIZING"].includes(s.upload_status)
  );

  if (isStatementsLoading || isLoading) {
    return (
      <PageContainer>
        <div className="flex h-[calc(100vh-10rem)] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading transactions...
        </div>
      </PageContainer>
    );
  }

  if (!hasCompleted) {
    if (hasProcessing) {
      return (
        <PageContainer>
          <SectionHeader
            eyebrow="Processing"
            title="Analyzing Statement"
            description="We are processing your documents to generate your ledger."
          />
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Processing your statement...</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Our AI engine is currently parsing and normalizing your transactions. This usually takes under 10 seconds.
            </p>
          </div>
        </PageContainer>
      );
    }

    const hasFailed = statements && statements.length > 0 && statements.every(s => s.upload_status === "FAILED");
    if (hasFailed) {
      return (
        <PageContainer>
          <SectionHeader
            eyebrow="Error"
            title="Analysis Failed"
            description="We encountered an issue with your statement."
          />
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-card p-12 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Statement processing failed</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We encountered an error while parsing your uploaded file. Please make sure you upload a supported PDF or CSV statement.
            </p>
            <div className="mt-6">
              <Link to="/upload">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  Try Uploading Again
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Ledger"
          title="Transactions"
          description="Every line of every statement — searchable, categorized, exportable."
        />
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-foreground">Upload your first bank statement</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Get instant AI insights, category spend breakdowns, and financial health score analysis by uploading your statement.
          </p>
          <div className="mt-6">
            <Link to="/upload">
              <Button variant="hero">
                Import Statement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const transactions = txnsData?.items || [];
  const totalItems = txnsData?.total || transactions.length;
  const totalPages = txnsData?.pages || Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Inflows & outflows calculation
  const inflows = transactions
    .filter((t) => t.transaction_type === "CREDIT")
    .reduce((acc, t) => acc + t.amount, 0);
  const outflows = Math.abs(
    transactions
      .filter((t) => t.transaction_type === "DEBIT")
      .reduce((acc, t) => acc + t.amount, 0)
  );
  const netSavings = inflows - outflows;

  const handleExportCSV = () => {
    const headers = ["Description,Merchant,Category,Channel,Date,Amount,Type\n"];
    const rows = transactions.map(
      (t) =>
        `"${t.description.replace(/"/g, '""')}","${(t.merchant_name || "").replace(
          /"/g,
          '""'
        )}","${t.category_name || "General"}","Card","${t.transaction_date}",${t.amount},"${
          t.transaction_type
        }"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows.join("\n")).join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nairalens_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transactions exported successfully!");
  };

  return (
    <PageContainer>
      <SectionHeader
        eyebrow="Ledger"
        title="Transactions"
        description="Every line of every statement — searchable, categorized, exportable."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                toast.success("Ledger refreshed.");
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Ledger
            </Button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-4"
      >
        {/* Filter bar */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search merchant, category, or amount…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full rounded-lg border border-border bg-surface/60 pl-10 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCat(c);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    selectedCat === c
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary box based on filtered subset */}
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            {
              label: "Net cash change",
              value: `₦${netSavings.toLocaleString()}`,
              tone: netSavings >= 0 ? "text-primary" : "text-destructive",
            },
            { label: "Total inflows", value: `₦${inflows.toLocaleString()}`, tone: "text-primary" },
            {
              label: "Total outflows",
              value: `₦${outflows.toLocaleString()}`,
              tone: "text-destructive",
            },
            { label: "Total items", value: `${totalItems}`, tone: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <p className={`font-display mt-1 text-2xl italic tracking-tight ${s.tone}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" /> Fetching ledger transactions...
            </div>
          ) : totalItems === 0 ? (
            <div className="rounded-2xl bg-card p-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No matching transactions found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your filters or upload a new statement.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] gap-4 border-b border-border px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <span>Description</span>
                <span>Category</span>
                <span>Merchant</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
              </div>
              <ul className="divide-y divide-border">
                {transactions.map((t) => {
                  const isCredit = t.transaction_type === "CREDIT";
                  const catName = t.category_name || "General";
                  const IconComp = getIconForCategory(catName);
                  return (
                    <li
                      key={t.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition hover:bg-accent/40 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                            isCredit ? "bg-primary-soft/50 text-primary" : "bg-accent text-foreground"
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{t.description}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{t.merchant_name || "General Merchant"}</p>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <Badge variant={isCredit ? "soft" : "ghost"}>{catName}</Badge>
                      </div>
                      <div className="hidden text-xs text-muted-foreground md:block">
                        {t.merchant_name || "Self Transfer"}
                      </div>
                      <div className="hidden text-xs text-muted-foreground md:block">{t.transaction_date}</div>
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${
                            isCredit ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          {isCredit ? "+" : "−"}₦{Math.abs(t.amount).toLocaleString()}
                        </span>
                        <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                <span>
                  Page {currentPage} of {totalPages} ({totalItems} total transactions)
                </span>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </PageContainer>
  );
}
