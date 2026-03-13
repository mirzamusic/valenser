import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { PageLayout } from "../components/PageLayout";
import { Button, ErrorText, Input, Label, SuccessText } from "../components/FormControls";

export default function ResetPasswordPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => authApi.requestPasswordResetCode(email),
    onSuccess: () => {
      setSuccess("If email exists, code is sent.");
      setTimeout(() => {
        navigate(`/reset-password/verify?email=${encodeURIComponent(email)}`);
      }, 600);
    }
  });

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <PageLayout title="Reset Password">
      <form onSubmit={onSubmit}>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        {success && <SuccessText>{success}</SuccessText>}

        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send reset code"}
        </Button>
      </form>
    </PageLayout>
  );
}
