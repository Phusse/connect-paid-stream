import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ParticipantTile: React.FC<{ name: string; active?: boolean }>
  = ({ name, active }) => (
  <div className={`aspect-video rounded-md border relative overflow-hidden ${active ? 'ring-2 ring-primary' : ''}`}>
    <div className="absolute inset-0 bg-muted" />
    <div className="absolute bottom-2 left-2 text-sm bg-background/80 px-2 py-1 rounded">{name}</div>
  </div>
);

const ChatPanel: React.FC<{ open: boolean } & { onSend: (text: string) => void; messages: { from: string; text: string; time: string }[] }>
  = ({ open, onSend, messages }) => {
  const [text, setText] = useState("");
  if (!open) return null;
  return (
    <div className="w-full md:w-80 border rounded-md p-3 flex flex-col gap-3">
      <div className="font-medium">Chat</div>
      <div className="flex-1 min-h-[200px] max-h-80 overflow-auto space-y-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className="p-2 rounded bg-secondary"> <span className="font-semibold">{m.from}:</span> {m.text} <span className="text-xs text-muted-foreground">· {m.time}</span></div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (!text) return; onSend(text); setText(""); }} className="flex gap-2">
        <input className="flex-1 border rounded px-2 py-1" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

const Meeting: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([
    { from: "System", text: "Welcome to the meeting!", time: "now" }
  ]);

  const participants = useMemo(() => [
    { name: "You" },
    { name: "Ada" },
    { name: "Tolu" },
    { name: "Chi" },
  ], []);

  return (
    <>
      <Helmet>
        <title>Meeting {id} - Video Conferencing MVP</title>
        <meta name="description" content={`Join meeting ${id} with audio, video, chat, and screen share (prototype).`} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-4">
          {sharing && (
            <Card className="p-3">Screen sharing is ON (simulated)</Card>
          )}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {participants.map((p, i) => (
              <ParticipantTile key={i} name={p.name} active={i === 0 && !muted && camera} />
            ))}
          </div>

          <div className="flex items-center gap-2 border rounded-md p-3 sticky bottom-0 bg-background">
            <Button variant={muted ? "secondary" : "default"} onClick={() => setMuted(v => !v)}>{muted ? "Unmute" : "Mute"}</Button>
            <Button variant={camera ? "default" : "secondary"} onClick={() => setCamera(v => !v)}>{camera ? "Camera Off" : "Camera On"}</Button>
            <Button variant={sharing ? "destructive" : "default"} onClick={() => setSharing(v => !v)}>{sharing ? "Stop Share" : "Share Screen"}</Button>
            <Button variant="secondary" onClick={() => setChatOpen(v => !v)}>{chatOpen ? "Hide Chat" : "Show Chat"}</Button>
            <div className="ml-auto">
              <Button variant="destructive" onClick={() => navigate("/dashboard")}>Leave</Button>
            </div>
          </div>
        </div>

        <ChatPanel open={chatOpen} messages={messages} onSend={(t) => setMessages(m => [...m, { from: "You", text: t, time: new Date().toLocaleTimeString() }])} />
      </div>
    </>
  );
};

export default Meeting;
