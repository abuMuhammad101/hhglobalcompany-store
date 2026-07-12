import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin — Quote Requests",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = getSupabase();

  if (!supabase) {
    return (
      <main className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <h1 className="text-2xl mb-4">Admin — not connected yet</h1>
          <p className="text-ink-muted text-[15px]">
            This page will list every quote request once Supabase is connected. Until then, quote
            requests are only arriving by email. Set the <code>SUPABASE_URL</code> and{" "}
            <code>SUPABASE_SERVICE_KEY</code> environment variables in Vercel to enable this
            dashboard.
          </p>
        </div>
      </main>
    );
  }

  const { data: quotes } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <h1 className="text-2xl mb-8">Quote Requests</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-line text-ink-muted uppercase text-xs tracking-wide">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email / Phone</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Style</th>
                <th className="py-3 pr-4">Qty</th>
                <th className="py-3 pr-4">Details</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {(quotes ?? []).map((q) => (
                <tr key={q.id} className="border-b border-line align-top">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {q.created_at ? new Date(q.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 pr-4">{q.full_name}</td>
                  <td className="py-3 pr-4">{q.email}<br />{q.phone}</td>
                  <td className="py-3 pr-4">{q.category}</td>
                  <td className="py-3 pr-4">{q.product_type}</td>
                  <td className="py-3 pr-4">{q.variant || "—"}</td>
                  <td className="py-3 pr-4">{q.quantity}</td>
                  <td className="py-3 pr-4 max-w-[240px]">{q.details || "—"}</td>
                  <td className="py-3 pr-4">{q.status || "new"}</td>
                </tr>
              ))}
              {(!quotes || quotes.length === 0) && (
                <tr>
                  <td colSpan={9} className="py-8 text-ink-muted text-center">
                    No quote requests yet.
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
