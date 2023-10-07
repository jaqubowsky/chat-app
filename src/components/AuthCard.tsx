import { SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const AuthCard = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-muted p-12 shadow-inner">
      <h1 className="text-4xl">Welcome!</h1>
      <p>Login to unlock our app full potential!</p>

      <SignInButton>
        <Button size="lg">Sign In</Button>
      </SignInButton>
    </div>
  );
};

export default AuthCard;
