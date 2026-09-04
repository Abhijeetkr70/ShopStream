import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center py-10">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#FF5200" },
        }}
      />
    </main>
  );
}
