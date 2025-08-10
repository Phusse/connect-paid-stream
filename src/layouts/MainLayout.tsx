import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="font-semibold">Connect Paid Stream</Link>
          <nav className="flex items-center gap-2">
            <Link to="/notifications" className="text-sm">Notifications</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm">Dashboard</Link>
                <Button variant="secondary" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm">Login</Link>
                <Button onClick={() => navigate("/signup")}>Sign up</Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
