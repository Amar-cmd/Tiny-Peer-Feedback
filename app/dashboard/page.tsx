"use client";

import { useEffect, useMemo, useState } from "react";
import { USERS } from "@/lib/data";
import { clearAllFeedback, getAllFeedback } from "@/lib/storage";
import type { Feedback } from "@/lib/types";

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default function DashboardPage() {
  const [all, setAll] = useState<Feedback[]>([]);

  function refresh() {
    setAll(getAllFeedback());
  }

  useEffect(() => {
    refresh();
  }, []);

  const rows = useMemo(() => {
    return USERS.map((u) => {
      const items = all.filter((f) => f.toUserId === u.id);

      const teamwork = avg(items.map((i) => i.ratings.teamwork));
      const ownership = avg(items.map((i) => i.ratings.ownership));
      const communication = avg(items.map((i) => i.ratings.communication));
      const reliability = avg(items.map((i) => i.ratings.reliability));
      const overall = avg([teamwork, ownership, communication, reliability]);

      return {
        user: u,
        count: items.length,
        overall,
      };
    }).sort((a, b) => (b.overall || 0) - (a.overall || 0));
  }, [all]);

  return (
    <main style={{ display: "grid", gap: 12 }}>
      <h2 className="h2">Professor Dashboard</h2>

      {/* Controls */}
      <div className="card cardPad">
        <div className="btnRow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 950 }}>Overview</div>
            <div className="p" style={{ fontSize: 12 }}>
              Total feedback entries:{" "}
              <b style={{ color: "var(--text)" }}>{all.length}</b>
            </div>
          </div>

          <div className="btnRow">
            <button onClick={refresh} className="btn">
              Refresh
            </button>

            <button
              onClick={() => {
                clearAllFeedback();
                refresh();
              }}
              className="btn btnGhost"
              title="Clears localStorage demo data"
            >
              Clear demo data
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card cardPad">
        <div className="btnRow" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 950 }}>Team Scores</div>
            <div className="p" style={{ fontSize: 12 }}>
              Quick scan of peer feedback averages (demo analytics).
            </div>
          </div>

          <span className="badge">Sorted by Overall</span>
        </div>

        <div style={{ height: 12 }} />

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Team</Th>
                <Th>Feedback Count</Th>
                <Th>Overall Avg</Th>
                <Th>Status</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.user.id}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AvatarInitials name={r.user.name} />
                      <div>
                        <div style={{ fontWeight: 950 }}>{r.user.name}</div>
                        <div className="p" style={{ fontSize: 12 }}>
                          {r.count >= 2 ? "Peer insights available" : "Low data"}
                        </div>
                      </div>
                    </div>
                  </Td>

                  <Td>{r.user.team}</Td>

                  <Td>
                    <span className="badge">{r.count}</span>
                  </Td>

                  <Td style={{ fontWeight: 950 }}>
                    {r.overall ? r.overall.toFixed(2) : "—"}
                  </Td>

                  <Td>
                    <span className={`badge ${statusTone(r.overall, r.count)}`}>
                      {statusLabel(r.overall, r.count)}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p" style={{ marginTop: 12, fontSize: 12 }}>
          Demo “status” helps show how HR/Prof can spot coaching needs quickly.
        </div>
      </div>
    </main>
  );
}

function statusLabel(overall: number, count: number) {
  if (count < 2) return "Not enough data";
  if (overall >= 4.2) return "High performer";
  if (overall >= 3.6) return "Stable";
  if (overall > 0) return "Needs coaching";
  return "—";
}

function statusTone(overall: number, count: number) {
  if (count < 2) return "warn";
  if (overall >= 4.2) return "good";
  if (overall >= 3.6) return "warn";
  if (overall > 0) return "bad";
  return "";
}

function Th({ children }: { children: React.ReactNode }) {
  return <th>{children}</th>;
}

function Td({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <td style={style}>{children}</td>;
}

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        fontWeight: 950,
        color: "white",
        background: "linear-gradient(90deg, var(--accent1), var(--accent2))",
        boxShadow: "0 10px 22px rgba(124,58,237,0.18)",
        border: "1px solid rgba(255,255,255,0.12)",
        flexShrink: 0,
      }}
    >
      {initials || "U"}
    </div>
  );
}
