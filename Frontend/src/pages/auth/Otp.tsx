import { OtpForm } from "../../components/auth/OptForm";
import { CardDescription } from "../../components/ui/card";
import useAuthStore from "../../store/authStore";

export default function SignUpPage() {
  const authStore = useAuthStore();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <CardDescription>
        Enter the OTP sent to 09{authStore.phone}
      </CardDescription>
      <div className="w-full max-w-sm">
        <OtpForm />
      </div>
    </div>
  );
}
