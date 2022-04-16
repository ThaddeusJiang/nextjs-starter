import { Meta } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { mockMansion } from "data/mocks";
import { MansionHosts } from "./MansionHosts";

export default {
  component: MansionHosts,
  title: "MansionHosts",
} as Meta;

const queryClient = new QueryClient();

export const HostInitialAccount: React.VFC = () => (
  <QueryClientProvider client={queryClient}>
    <MansionHosts mansion={{ ...mockMansion, id: "dev" }} />
  </QueryClientProvider>
);
