import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, SectionHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useFinanceStore, getIconForCategory, Transaction } from "@/lib/store";
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
  const { transactions, resetStore } = useFinanceStore();
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Dynamic filtering & search matching
  const filtered = transactions.filter((t) => {
    const matchesCategory = selectedCat === "All" || t.cat === selectedCat;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(query) ||
      t.merchant.toLowerCase().includes(query) ||
      t.cat.toLowerCase().includes(query) ||
      t.amount.toString().includes(query) ||
      t.date.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // 2. Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  // 3. Current month statistics based on active filters
  const julyTransactions = filtered.filter((t) => t.date.includes("Jul"));
  const inflows = julyTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const outflows = Math.abs(
    julyTransactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0),
  );
  const netSavings = inflows - outflows;

  const handleExportCSV = () => {
    const headers = ["Description,Merchant,Category,Channel,Date,Amount,Type\n"];
    const rows = filtered.map(
      (t) =>
        `"${t.name.replace(/"/g, '""')}","${t.merchant.replace(/"/g, '""')}","${t.cat}","${t.channel}","${t.date}",${t.amount},"${t.type}"`,
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
                resetStore();
                toast.success("Ledger reset to defaults.");
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Ledger
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
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selectedCat === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"}`}
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
              label: "July net change",
              value: `₦${netSavings.toLocaleString()}`,
              tone: netSavings >= 0 ? "text-primary" : "text-destructive",
            },
            { label: "July inflows", value: `₦${inflows.toLocaleString()}`, tone: "text-primary" },
            {
              label: "July outflows",
              value: `₦${outflows.toLocaleString()}`,
              tone: "text-destructive",
            },
            { label: "Matching rows", value: `${totalItems}`, tone: "text-foreground" },
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
          {totalItems === 0 ? (
            <div className="rounded-2xl bg-card p-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No matching transactions found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your filters or search keywords.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto] gap-4 border-b border-border px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <span>Description</span>
                <span>Category</span>
                <span>Channel</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
              </div>
              <ul className="divide-y divide-border">
                {paginatedItems.map((t, i) => {
                  const IconComp = getIconForCategory(t.cat);
                  return (
                    <li
                      key={t.id || i}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition hover:bg-accent/40 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr_auto]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${t.type === "credit" ? "bg-primary-soft/50 text-primary" : "bg-accent text-foreground"}`}
                        >
                          <IconComp className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{t.merchant}</p>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <Badge variant={t.type === "credit" ? "soft" : "ghost"}>{t.cat}</Badge>
                      </div>
                      <div className="hidden text-xs text-muted-foreground md:block">
                        {t.channel}
                      </div>
                      <div className="hidden text-xs text-muted-foreground md:block">{t.date}</div>
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${t.type === "credit" ? "text-primary" : "text-foreground"}`}
                        >
                          {t.type === "credit" ? (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          {t.type === "credit" ? "+" : "−"}₦{Math.abs(t.amount).toLocaleString()}
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
                  Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                  {totalItems}
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
