import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Peer Feedback MVP",
  description: "Minimal peer-to-peer feedback system prototype",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="header">
          <div className="container">
            <div className="headerRow">
              <div>
                <div className="brandTitle">Peer Feedback MVP</div>
              </div>

              <nav className="nav">
                <a href="/">Home</a>
                <a href="/give-feedback">Give</a>
                <a href="/my-summary">My Summary</a>
                <a href="/dashboard">Dashboard</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="container">
          {children}
          <div className="footer">
            TEAM 3: PIYUSH SINGH • RAHUL KUMAR • RATNESH SINGH • REET SAXENA • RIYA PARIHAR • SAHIL BHAN • SHAGUN GUPTA
          </div>
        </div>
      </body>
    </html>
  );
}
