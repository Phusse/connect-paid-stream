import React from "react";
import { Helmet } from "react-helmet-async";

const Notifications: React.FC = () => {
  const items = [
    { id: 1, title: "Maintenance window", body: "We will perform updates on Saturday 10 PM WAT.", date: "2025-08-01" },
    { id: 2, title: "New feature", body: "Screen share improvements are coming soon.", date: "2025-07-10" },
  ];

  return (
    <>
      <Helmet>
        <title>Notifications - Video Conferencing MVP</title>
        <meta name="description" content="Read the latest platform updates and announcements (prototype)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <ul className="space-y-3">
          {items.map(n => (
            <li key={n.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{n.title}</h2>
                <time className="text-sm text-muted-foreground">{n.date}</time>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Notifications;
