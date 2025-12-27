"use client";

import { useMemo, useState } from "react";
import { USERS, QUESTIONS, type QuestionKey } from "@/lib/data";
import { saveFeedback, uid } from "@/lib/storage";
import type { Feedback } from "@/lib/types";

const clamp1to5 = (n: number) => Math.max(1, Math.min(5, n));

export default function GiveFeedbackPage() {
  // Demo: choose sender too (optional)
  const [fromUserId, setFromUserId] = useState(USERS[0].id);
  const [toUserId, setToUserId] = useState(USERS[1].id);

  const [anonymous, setAnonymous] = useState(true);
  const [comment, setComment] = useState("");

  const [ratings, setRatings] = useState<Record<QuestionKey, number>>({
    teamwork: 4,
    ownership: 4,
    communication: 4,
    reliability: 4,
  });

  const [msg, setMsg] = useState<string>("");

  const teammateOptions = useMemo(() => USERS.filter((u) => u.id !== fromUserId), [fromUserId]);

  function setRating(key: QuestionKey, val: number) {
    setRatings((prev) => ({ ...prev, [key]: clamp1to5(val) }));
  }

  function submit() {
    if (fromUserId === toUserId) {
      setMsg("You cannot give feedback to yourself.");
      return;
    }

    const item: Feedback = {
      id: uid(),
      fromUserId,
      toUserId,
      anonymous,
      ratings: {
        teamwork: ratings.teamwork,
        ownership: ratings.ownership,
        communication: ratings.communication,
        reliability: ratings.reliability,
      },
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    saveFeedback(item);

    setMsg("Feedback submitted!");
    setComment("");
    // keep ratings as-is so it’s quick to submit multiple
    setTimeout(() => setMsg(""), 2000);
  }

  return (
  <main style={{ display: "grid", gap: 12 }}>
    <h2 className="h2">Give Feedback</h2>

    <div className="card cardPad">
      <div className="rowGrid">
        <Field label="I am (giver)">
          <select value={fromUserId} onChange={(e) => setFromUserId(e.target.value)}>
            {USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.team}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Feedback for (receiver)">
          <select value={toUserId} onChange={(e) => setToUserId(e.target.value)}>
            {teammateOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.team}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Anonymous">
          <label style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 6 }}>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="badge">
              {anonymous ? "Anonymous ON" : "Anonymous OFF"}
            </span>
          </label>
        </Field>
      </div>
    </div>

    <div className="card cardPad">
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Rate (1 to 5)</div>

      <div className="rowGrid">
        {QUESTIONS.map((q) => (
          <div key={q.key} className="miniCard">
            <div className="miniTitle">{q.label}</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="range"
                min={1}
                max={5}
                value={ratings[q.key]}
                onChange={(e) => setRating(q.key, Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <span className="badge">{ratings[q.key]}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Comment (optional)</div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="1 line: what should they keep doing / improve?"
          rows={3}
        />
      </div>

      <div className="btnRow" style={{ marginTop: 12 }}>
        <button onClick={submit} className="btn">Submit</button>

        {msg && (
          <span
            className={`badge ${msg.startsWith("✅") ? "good" : "bad"}`}
            style={{ borderColor: "rgba(255,255,255,0.16)" }}
          >
            {msg}
          </span>
        )}
      </div>
    </div>
  </main>
);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid" }}>
      <div className="label">{label}</div>
      {children}
    </div>
  );
}


const cardStyle: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};
