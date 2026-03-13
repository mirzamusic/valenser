import { FormEvent, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { PageLayout } from "../components/PageLayout";
import { Button, ErrorText, Input, Label, SuccessText } from "../components/FormControls";

export default function VerifyRegistrationPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const email = useMemo(() => new URLSearchParams(location.search).get("email") ?? "", [location.search]);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: () => authApi.completeRegistration(email, code, password),
    onSuccess: () => {
      setSuccess("Account is ready. Please login.");
      setTimeout(() => navigate("/login"), 800);
    }
  });

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <PageLayout title="Verify Registration">
      <form onSubmit={onSubmit}>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        {success && <SuccessText>{success}</SuccessText>}

        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} readOnly />

        <Label htmlFor="code">Verification Code</Label>
        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required minLength={6} maxLength={6} />

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <Button type="submit" disabled={mutation.isPending || !email}>
          {mutation.isPending ? "Verifying..." : "Verify & Set Password"}
        </Button>
      </form>
    </PageLayout>
  );
}
