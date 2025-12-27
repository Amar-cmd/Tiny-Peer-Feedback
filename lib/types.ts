export type User = {
  id: string;
  name: string;
  team: string;
};

export type Feedback = {
  id: string;              // unique feedback id
  fromUserId: string;      // who gave (optional use)
  toUserId: string;        // who received
  anonymous: boolean;

  // ratings: 1-5
  ratings: {
    teamwork: number;
    ownership: number;
    communication: number;
    reliability: number;
  };

  comment: string;
  createdAt: string;       // ISO string
};
