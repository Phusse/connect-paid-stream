import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, User, Video, VideoOff, ScreenShare, MessageSquare, Users, PhoneOff } from "lucide-react";
import useWebRTC from "@/hooks/useWebRTC";
import Peer from "simple-peer";

const VideoPlayer = ({ peer, stream }: { peer?: Peer.Instance, stream?: MediaStream }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (peer) {
      peer.on('stream', (remoteStream) => {
        if (ref.current) {
          ref.current.srcObject = remoteStream;
        }
      });
    } else if (stream) {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    }
  }, [peer, stream]);

  return (
    <video playsInline autoPlay ref={ref} className="h-full w-full object-contain" muted={!!stream} />
  );
};

const ChatPanel: React.FC<{ open: boolean; onSend: (text: string) => void; messages: { from: string; text: string; time: string }[] }> = ({ open, onSend, messages }) => {
  const [text, setText] = useState("");
  if (!open) return null;
  return (
    <div className="w-full md:w-80 border rounded-md p-3 flex flex-col gap-3 bg-background h-full">
      <div className="font-medium text-center">Chat</div>
      <div className="flex-1 min-h-[200px] overflow-auto space-y-4 text-sm p-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.from === "You" ? "items-end" : "items-start"}`}>
            <div className={`p-2 rounded-lg max-w-[80%] ${m.from === "You" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              <div className="font-semibold">{m.from}</div>
              <div>{m.text}</div>
              <div className="text-xs text-muted-foreground/80 text-right mt-1">{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (!text) return; onSend(text); setText(""); }} className="flex gap-2 pt-2 border-t">
        <input className="flex-1 border rounded px-3 py-2 bg-input text-sm" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

const ParticipantsPanel: React.FC<{
  open: boolean;
  participants: { id: number; name: string; avatarUrl: string; isMuted: boolean; cameraOn: boolean; isYou?: boolean }[];
}> = ({ open, participants }) => {
  if (!open) return null;
  return (
    <div className="w-full md:w-80 border rounded-md p-3 flex flex-col gap-3 bg-background">
      <div className="font-medium">Participants ({participants.length})</div>
      <div className="flex-1 space-y-2 text-sm overflow-auto">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-2 rounded bg-secondary">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={p.avatarUrl} />
                <AvatarFallback><User size={16} /></AvatarFallback>
              </Avatar>
              <span>{p.name} {p.isYou && '(You)'}</span>
            </div>
            <div className="flex items-center gap-2">
              {p.isMuted ? <MicOff size={16} className="text-muted-foreground" /> : <Mic size={16} className="text-muted-foreground" />}
              {p.cameraOn ? <Video size={16} className="text-muted-foreground" /> : <VideoOff size={16} className="text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Meeting: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([
    { from: "System", text: "Welcome to the meeting!", time: "now" }
  ]);
  const [stream, setStream] = useState<MediaStream>();
  const { peers, toggleMute, toggleCamera } = useWebRTC(id!, stream);
  const userVideo = useRef<HTMLVideoElement>(null);
  const [activePeer, setActivePeer] = useState<Peer.Instance | 'me'>('me');

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
  }, []);

  const participants = useMemo(() => [
    { id: 1, name: "You", avatarUrl: "https://github.com/shadcn.png", isMuted: muted, cameraOn: camera, isYou: true },
    ...peers.map((_, index) => ({ id: index + 2, name: `Peer ${index + 1}`, avatarUrl: `https://randomuser.me/api/portraits/men/${index + 40}.jpg`, isMuted: false, cameraOn: true }))
  ], [peers, muted, camera]);

  return (
    <>
      <Helmet>
        <title>Meeting {id} - Video Conferencing MVP</title>
        <meta name="description" content={`Join meeting ${id} with audio, video, chat, and screen share (prototype).`} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground">
        <div className="flex-1 flex flex-col p-4 gap-4">
          {sharing && (
            <Card className="p-3 mb-4">Screen sharing is ON (simulated)</Card>
          )}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 bg-muted rounded-md flex items-center justify-center">
              {activePeer === 'me' ? (
                <VideoPlayer stream={stream} />
              ) : (
                <VideoPlayer peer={activePeer as Peer.Instance} />
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto p-2 bg-secondary/30 rounded-md h-40">
              <div
                className={`w-40 aspect-video rounded-md border relative overflow-hidden group cursor-pointer ${activePeer === 'me' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActivePeer('me')}
              >
                <VideoPlayer stream={stream} />
                <div className="absolute bottom-1 left-1 text-xs bg-background/80 px-1 rounded">You</div>
              </div>
              {peers.map((peer, index) => (
                <div
                  key={index}
                  className={`w-40 aspect-video rounded-md border relative overflow-hidden group cursor-pointer ${activePeer === peer ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActivePeer(peer)}
                >
                  <VideoPlayer peer={peer} />
                  <div className="absolute bottom-1 left-1 text-xs bg-background/80 px-1 rounded">Peer {index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 border rounded-md p-3 bg-card sticky bottom-0">
            <Button variant={muted ? "secondary" : "default"} onClick={() => {
              setMuted(v => !v);
              toggleMute();
            }} size="lg" className="flex gap-2 items-center">
              {muted ? <MicOff /> : <Mic />} {muted ? "Unmute" : "Mute"}
            </Button>
            <Button variant={camera ? "default" : "secondary"} onClick={() => {
              setCamera(v => !v);
              toggleCamera();
            }} size="lg" className="flex gap-2 items-center">
              {camera ? <Video /> : <VideoOff />} {camera ? "Cam Off" : "Cam On"}
            </Button>
            <Button variant={sharing ? "destructive" : "default"} onClick={() => setSharing(v => !v)} size="lg" className="flex gap-2 items-center">
              <ScreenShare /> {sharing ? "Stop" : "Share"}
            </Button>
            <Button variant={participantsOpen ? 'default' : 'secondary'} onClick={() => { setParticipantsOpen(v => !v); setChatOpen(false); }} size="lg" className="flex gap-2 items-center"><Users /> Participants ({peers.length + 1})</Button>
            <Button variant={chatOpen ? 'default' : 'secondary'} onClick={() => { setChatOpen(v => !v); setParticipantsOpen(false); }} size="lg" className="flex gap-2 items-center"><MessageSquare /> Chat</Button>
            <div className="ml-auto">
              <Button variant="destructive" onClick={() => navigate("/dashboard")} size="lg" className="flex gap-2 items-center"><PhoneOff /> Leave</Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80">
          {chatOpen && <ChatPanel open={chatOpen} messages={messages} onSend={(t) => setMessages(m => [...m, { from: "You", text: t, time: new Date().toLocaleTimeString() }])} />}
          {participantsOpen && <ParticipantsPanel open={participantsOpen} participants={participants} />}
        </div>
      </div>
    </>
  );
};

export default Meeting;
