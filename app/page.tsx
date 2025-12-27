export default function HomePage() {
  return (
    <main>
      <h1 className="h1">Peer Feedback System</h1>
      <p className="p">
        Peer-to-Peer Performance Feedback System (Performance Management).
      </p>

      <div style={{ height: 14 }} />

      <div className="gridCards">
        <Card title="1) Give Feedback" href="/give-feedback" desc="Submit rating + comment with anonymous toggle." />
        <Card title="2) My Summary" href="/my-summary" desc="See average ratings + themes for a selected user." />
        <Card title="3) Dashboard" href="/dashboard" desc="Professor view: team table of scores + feedback counts." />
      </div>
    </main>
  );
}

function Card({ title, href, desc }: { title: string; href: string; desc: string }) {
  return (
    <a className="feature" href={href}>
      <div className="featureTitle">{title}</div>
      <div className="featureDesc">{desc}</div>
      <div className="featureCta">Open →</div>
    </a>
  );
}
