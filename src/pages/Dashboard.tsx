import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const genMeetingCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <>
      <Helmet>
        <title>Dashboard - Video Conferencing MVP</title>
        <meta name="description" content="Create or join a meeting, and view notifications (prototype)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate(`/meeting/${genMeetingCode()}`)}>Create Meeting</Button>
            <p className="text-sm text-muted-foreground">Share the link with participants.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Join a Meeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter meeting code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <Button onClick={() => code && navigate(`/meeting/${code}`)} disabled={!code}>Join</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
