import AuthCard from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import Head from "next/head";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Live message sending app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col items-center justify-center bg-background p-16">
        {!isSignedIn && isLoaded && <AuthCard />}

        {isSignedIn && isLoaded && (
          <div className="flex h-full max-h-full w-full max-w-full gap-4 rounded-lg bg-muted p-12 shadow-inner">
            <div className="flex h-full w-full">
              <div className="w-1/5"></div>
              <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                <Card className="flex h-full w-full flex-col gap-4 p-4">
                  <div className="self-end rounded-full bg-primary p-3 text-primary-foreground">
                    Sample message from me...
                  </div>
                  <div className="self-start rounded-full bg-secondary p-3 text-primary-foreground">
                    Sample message from other...
                  </div>
                </Card>
                <div className="flex w-full gap-2">
                  <Input placeholder="Send message..." />
                  <Button>Send</Button>
                </div>
              </div>
              <div className="w-1/5"></div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
