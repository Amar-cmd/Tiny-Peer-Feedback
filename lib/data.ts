import type { User } from "./types";

export const USERS: User[] = [
  { id: "u1", name: "PIYUSH SINGH", team: "Team 3" },
  { id: "u2", name: "RAHUL KUMAR", team: "Team 3" },
  { id: "u3", name: "RATNESH SINGH", team: "Team 3" },
  { id: "u4", name: "REET SAXENA", team: "Team 3" },
  { id: "u5", name: "RIYA PARIHAR", team: "Team 3" },
  { id: "u6", name: "SAHIL BHAN", team: "Team 3" },
  { id: "u7", name: "SHAGUN GUPTA", team: "Team 3" },
];

export const QUESTIONS = [
  { key: "teamwork", label: "Teamwork" },
  { key: "ownership", label: "Ownership" },
  { key: "communication", label: "Communication" },
  { key: "reliability", label: "Reliability" },
] as const;

export type QuestionKey = (typeof QUESTIONS)[number]["key"];
