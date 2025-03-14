import { Registration } from "@/components/auth/Registration"

export const RegistrationPage = () => {
  return (
    <div className="flex min-h-svh w-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Registration />
      </div>
    </div>
  );
};
