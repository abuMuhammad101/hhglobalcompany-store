import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Admin — Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = getSupabase();
  const catalog = await getCatalog();
  const productCount = catalog.reduce((n, c) => n + c.products.length, 0);
  const categoryCount = catalog.length;

  let newQuotes = 0;
  let totalQuotes = 0;
  let recentQuotes: { id: number; full_name: string; product_type: string; status: string; created_at: string }[] = [];

  if (supabase) {
    const { data: statusRows } = await supabase.from("quote_requests").select("status");
    totalQuotes = statusRows?.length ?? 0;
    newQuotes = statusRows?.filter((r) => r.status === "new").length ?? 0;

    const { data } = await supabase
      .from("quote_requests")
      .select("id, full_name, product_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    recentQuotes = data ?? [];
  }

  return (
    <main className="py-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-2xl mb-8">Dashboard</h1>

        {!supabase && (
          <div className="mb-8 border border-line rounded-lg p-5 text-sm text-ink-muted">
            Not connected to Supabase — quotes only arrive by email, and stats below are
            unavailable. See <code>CLAUDE.md</code> for setup.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="New Quote Requests" value={newQuotes} href="/admin/quotes?status=new" highlight={newQuotes > 0} />
          <StatCard label="Total Quote Requests" value={totalQuotes} href="/admin/quotes" />
          <StatCard label="Products" value={productCount} href="/admin/products" />
          <StatCard label="Categories" value={categoryCount} href="/admin/categories" />
        </div>

        <div className="border border-line rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h2 className="text-sm font-medium uppercase tracking-wide">Recent Quote Requests</h2>
            <Link href="/admin/quotes" className="text-xs text-ink-muted hover:text-ink">
              View all &rarr;
            </Link>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="text-sm text-ink-muted px-5 py-8 text-center">No quote requests yet.</p>
          ) : (
            <ul>
              {recentQuotes.map((q) => (
                <li key={q.id} className="flex items-center justify-between px-5 py-3 border-b border-line last:border-b-0 text-sm">
                  <div>
                    <span className="font-medium">{q.full_name}</span>
                    <span className="text-ink-muted"> — {q.product_type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-ink-faint">
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                    <StatusPill status={q.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border rounded-lg p-5 transition-colors ${
        highlight ? "border-accent bg-accent-soft/40" : "border-line hover:border-ink-faint"
      }`}
    >
      <span className="block text-3xl font-medium mb-1">{value}</span>
      <span className="block text-xs uppercase tracking-wide text-ink-muted">{label}</span>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full border border-line text-ink-muted capitalize">
      {status}
    </span>
  );
}
