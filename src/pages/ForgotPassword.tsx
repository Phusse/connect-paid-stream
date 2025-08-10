import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Reset link sent", description: `A reset link was sent to ${email} (simulated).` });
    setEmail("");
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Video Conferencing MVP</title>
        <meta name="description" content="Reset your password via email link (prototype)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ForgotPassword;
