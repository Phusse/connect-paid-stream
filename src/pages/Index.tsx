import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Video Conferencing MVP - Connect Paid Stream</title>
        <meta name="description" content="Join secure video meetings with chat and screen share. Sign up with a one-time ₦1,000 NGN fee (prototype)." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <header className="border-b">
        <div className="container py-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Video Conferencing MVP</h1>
          <p className="text-lg text-muted-foreground">Clean, minimal meetings with chat and screen share.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container grid md:grid-cols-3 gap-6 py-10">
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-1">Create & Join</h2>
            <p className="text-sm text-muted-foreground">Generate a link or join with a code.</p>
          </div>
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-1">Video, Audio, Chat</h2>
            <p className="text-sm text-muted-foreground">Mute, camera toggle, and in-meeting chat.</p>
          </div>
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-1">Screen Share</h2>
            <p className="text-sm text-muted-foreground">Share your screen (simulated in prototype).</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
