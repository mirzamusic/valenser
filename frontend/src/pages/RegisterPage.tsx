import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { PageLayout } from "../components/PageLayout";
import { Button, ErrorText, Input, Label, SuccessText } from "../components/FormControls";

export default function RegisterPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => authApi.requestRegisterCode(email),
    onSuccess: () => {
      setSuccess("Verification code sent to email.");
      setTimeout(() => {
        navigate(`/register/verify?email=${encodeURIComponent(email)}`);
      }, 600);
    }
  });

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setSuccess("");
    mutation.mutate();
  };

  return (
    <PageLayout title="Register">
      <form onSubmit={onSubmit}>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        {success && <SuccessText>{success}</SuccessText>}

        <Label htmlFor="email">Company Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@valens.dev"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send verification code"}
        </Button>
      </form>
    </PageLayout>
  );
}
