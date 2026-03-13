import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { PageLayout } from "../components/PageLayout";
import { Button, ErrorText, Input, Label } from "../components/FormControls";
import { useAuth } from "../context/AuthContext";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => authApi.login(email, password),
    onSuccess: (response) => {
      login(response);
      navigate("/dashboard");
    }
  });

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <PageLayout title="Login">
      <form onSubmit={onSubmit}>
        {mutation.isError && <ErrorText>{(mutation.error as Error).message}</ErrorText>}
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Login"}
        </Button>
      </form>
    </PageLayout>
  );
}
