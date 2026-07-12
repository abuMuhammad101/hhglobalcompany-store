import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import QuoteRow from "@/components/admin/QuoteRow";
import type { QuoteRow as QuoteRowType } from "@/lib/types";

export const metadata: Metadata = { title: "Admin — Quotes" };
export const dynamic = "force-dynamic";

export default async function AdminQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = getSupabase();

  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-2xl mb-4">Quotes — not connected yet</h1>
          <p className="text-ink-muted text-[15px]">
            Quote requests are only arriving by email right now. Set{" "}
            <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_KEY</code> in Vercel (see{" "}
            <code>data/schema.sql</code> for the one-time setup script) to turn on this
            dashboard.
          </p>
        </div>
      </main>
    );
  }

  let query = supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: quotes } = await query;

  const statusCounts = await getStatusCounts(supabase);

  return (
    <main className="py-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl">Quote Requests</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <StatusFilterLink label="All" value={undefined} active={!status} count={statusCounts.all} />
          <StatusFilterLink label="New" value="new" active={status === "new"} count={statusCounts.new} />
          <StatusFilterLink label="Contacted" value="contacted" active={status === "contacted"} count={statusCounts.contacted} />
          <StatusFilterLink label="Quoted" value="quoted" active={status === "quoted"} count={statusCounts.quoted} />
          <StatusFilterLink label="Won" value="won" active={status === "won"} count={statusCounts.won} />
          <StatusFilterLink label="Lost" value="lost" active={status === "lost"} count={statusCounts.lost} />
        </div>

        <div className="overflow-x-auto border border-line rounded-md">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-line text-ink-muted uppercase text-xs tracking-wide bg-bg-soft">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Request</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4 min-w-[220px]">Notes</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {(quotes ?? []).map((q) => (
                <QuoteRow key={q.id} quote={q as QuoteRowType} />
              ))}
              {(!quotes || quotes.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-10 text-ink-muted text-center">
                    No quote requests {status ? `with status "${status}"` : "yet"}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatusFilterLink({
  label,
  value,
  active,
  count,
}: {
  label: string;
  value?: string;
  active: boolean;
  count: number;
}) {
  const href = value ? `/admin/quotes?status=${value}` : "/admin/quotes";
  return (
    <a
      href={href}
      className={`text-xs px-3 py-1.5 rounded-full border ${
        active ? "bg-ink text-on-dark border-ink" : "border-line text-ink-muted hover:border-ink-faint"
      }`}
    >
      {label} ({count})
    </a>
  );
}

async function getStatusCounts(supabase: NonNullable<ReturnType<typeof getSupabase>>) {
  const { data } = await supabase.from("quote_requests").select("status");
  const rows = data ?? [];
  const count = (s: string) => rows.filter((r) => r.status === s).length;
  return {
    all: rows.length,
    new: count("new"),
    contacted: count("contacted"),
    quoted: count("quoted"),
    won: count("won"),
    lost: count("lost"),
  };
}
