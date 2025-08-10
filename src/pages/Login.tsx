import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) {
      toast({ title: "Welcome back", description: "Logged in (prototype)." });
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    } else {
      toast({ title: "Login failed", description: "Check your email or sign up first." });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Video Conferencing MVP</title>
        <meta name="description" content="Login to access meetings and notifications (prototype)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="text-sm mt-4 flex justify-between">
            <Link to="/forgot-password" className="underline">Forgot password?</Link>
            <Link to="/signup" className="underline">Create account</Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Login;
