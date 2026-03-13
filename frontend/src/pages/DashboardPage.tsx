import { useAuth } from "../context/AuthContext";
import { PageLayout } from "../components/PageLayout";
import { Button } from "../components/FormControls";

export default function DashboardPage(): JSX.Element {
  const { user, logout } = useAuth();

  return (
    <PageLayout title="Dashboard">
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>Role:</strong> {user?.role}
      </p>
      <Button type="button" onClick={logout}>
        Logout
      </Button>
    </PageLayout>
  );
}
