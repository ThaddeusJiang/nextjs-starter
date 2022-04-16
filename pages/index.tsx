import { useSession } from "next-auth/react";
import Dashboard from "../components/Dashboard";

export default function Index() {
  const { data: session } = useSession();

  return <Dashboard />;
}
