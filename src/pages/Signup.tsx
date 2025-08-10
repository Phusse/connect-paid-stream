import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup: React.FC = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", paid: false });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.paid) {
      toast({ title: "Payment required", description: "Please confirm the ₦1,000 NGN payment (simulated)." });
      return;
    }
    const ok = await signup(form.name, form.email, form.password, true);
    if (ok) {
      toast({ title: "Signup complete", description: "Payment confirmed (simulated). Please log in." });
      navigate("/login");
    } else {
      toast({ title: "Email already registered", description: "Try logging in." });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Video Conferencing MVP</title>
        <meta name="description" content="Create your account and confirm a ₦1,000 NGN one-time fee (simulated)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="flex items-center gap-2">
              <input id="paid" type="checkbox" className="h-4 w-4" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} />
              <Label htmlFor="paid">I confirm the one-time payment of ₦1,000 NGN (simulated)</Label>
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Signup;
