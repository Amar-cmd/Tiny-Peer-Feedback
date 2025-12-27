"use client";

import { useEffect, useMemo, useState } from "react";
import { USERS } from "@/lib/data";
import { getFeedbackForUser } from "@/lib/storage";
import type { Feedback } from "@/lib/types";

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default function MySummaryPage() {
  const [userId, setUserId] = useState(USERS[0].id);
  const [items, setItems] = useState<Feedback[]>([]);

  useEffect(() => {
    setItems(getFeedbackForUser(userId));
  }, [userId]);

  const stats = useMemo(() => {
    const teamwork = avg(items.map((i) => i.ratings.teamwork));
    const ownership = avg(items.map((i) => i.ratings.ownership));
    const communication = avg(items.map((i) => i.ratings.communication));
    const reliability = avg(items.map((i) => i.ratings.reliability));
    const overall = avg([teamwork, ownership, communication, reliability]);

    const strengths: string[] = [];
    const improvements: string[] = [];

    const pushTheme = (label: string, value: number) => {
      if (value >= 4.2) strengths.push(label);
      else if (value > 0 && value <= 3.4) improvements.push(label);
    };

    pushTheme("Teamwork", teamwork);
    pushTheme("Ownership", ownership);
    pushTheme("Communication", communication);
    pushTheme("Reliability", reliability);

    return { teamwork, ownership, communication, reliability, overall, strengths, improvements };
  }, [items]);

  const user = USERS.find((u) => u.id === userId);

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 className="h2">My Feedback Summary</h2>

      {/* Picker */}
      <div className="card cardPad">
        <div className="btnRow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 950 }}>Select user</div>
            <div className="p" style={{ fontSize: 12 }}>
              View peer feedback summary (demo).
            </div>
          </div>

          <div style={{ minWidth: 260 }}>
            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
              {USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.team}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card cardPad">
        <div className="btnRow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 950, fontSize: 18 }}>
              {user?.name} • Overall: {stats.overall ? stats.overall.toFixed(2) : "—"}
            </div>
            <div className="p" style={{ fontSize: 13 }}>
              Total feedback received:{" "}
              <b style={{ color: "var(--text)" }}>{items.length}</b>
            </div>
          </div>

          <span className="badge">
            {items.length >= 2 ? "Data sufficient" : "Low data"}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginTop: 12,
          }}
        >
          <Metric label="Teamwork" value={stats.teamwork} />
          <Metric label="Ownership" value={stats.ownership} />
          <Metric label="Communication" value={stats.communication} />
          <Metric label="Reliability" value={stats.reliability} />
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Strengths</div>
            <ChipRow items={stats.strengths.length ? stats.strengths : ["No strong signal yet"]} />
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Needs Improvement</div>
            <ChipRow items={stats.improvements.length ? stats.improvements : ["No weak signal yet"]} />
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card cardPad">
        <div className="btnRow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 900 }}>Anonymous Comments</div>
            <div className="p" style={{ fontSize: 12 }}>
              Only comments are shown here (demo-friendly).
            </div>
          </div>
          <span className="badge">{items.length} entries</span>
        </div>

        <div style={{ height: 10 }} />

        {!items.length ? (
          <div className="p">
            No feedback yet. Go to <b>Give Feedback</b> and submit a few entries.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items
              .slice()
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .map((f) => (
                <div key={f.id} className="miniCard">
                  <div className="miniMuted">
                    {new Date(f.createdAt).toLocaleString()} •{" "}
                    <b style={{ color: "var(--text)" }}>
                      {f.anonymous ? "Anonymous" : "Named (demo)"}
                    </b>
                  </div>

                  <div style={{ marginTop: 8, color: "var(--text)" }}>
                    {f.comment ? (
                      f.comment
                    ) : (
                      <span style={{ color: "var(--muted)" }}>No comment</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const shown = value ? value.toFixed(2) : "—";

  // simple tone (optional)
  const tone =
    value >= 4.2 ? "good" : value > 0 && value <= 3.4 ? "bad" : "warn";

  return (
    <div className="miniCard">
      <div className="miniMuted" style={{ fontWeight: 900 }}>
        {label}
      </div>

      <div className="btnRow" style={{ justifyContent: "space-between", marginTop: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 950 }}>{shown}</div>
        <span className={`badge ${value ? tone : ""}`}>
          {value ? (value >= 4.2 ? "Strong" : value <= 3.4 ? "Improve" : "OK") : "—"}
        </span>
      </div>
    </div>
  );
}

function ChipRow({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {items.map((t, i) => (
        <span className="badge" key={`${t}_${i}`}>
          {t}
        </span>
      ))}
    </div>
  );
}
