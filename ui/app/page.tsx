import LoginForm from "@/app/components/loginForm";

export default function Home() {
  return (
    <main className="flex flex-col justify-between items-center min-h-screen">
      <div className="flex flex-1 justify-center items-center rounded-lg">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-bold text-4xl lg:text-8xl tracking-tight">
            VoiceBox
          </h1>
          <p className="text-muted-foreground">
            Realtime voice chat. Developed using NextJS and Golang
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
