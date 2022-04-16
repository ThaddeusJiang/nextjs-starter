import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import { mockHost, mockMansion } from "data/mocks";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import HostCreateForm from "./HostCreateForm";

const queryClient = new QueryClient();

describe("HostCreateForm", () => {
  it("create host: hosts in the mansion are exceed the limit", () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    const hosts = [];
    for (let i = 0; i < 30; i += 1) {
      const host = {
        ...mockHost,
        mansion: { id: "test-host-create-form-01", ...mockHost.mansion },
      };
      hosts.push(host);
    }
    mockAxios.onGet(getHostsUrl).reply(200, hosts, {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-30/30`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByLabelText("cname"), {
      target: { value: "test-jiang-01" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    expect(screen.getByText("Save")).toBeDisabled();
  });

  it("create host: should get mansions, and post host", () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByLabelText("cname"), {
      target: { value: "test-jiang-01" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    const createHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPost(
      createHostUrl,
      expect.objectContaining({
        mansionId: mansion.id,
        cname: "test-jiang-01",
        plan: "TRIAL",
        memo: "",
      })
    );
  });

  it("create host: domain error（Illegal domain）： Start from numbers", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "090test-jiang-01aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Illegal domain）Start from hyphen", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "-test-jiang-01aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Required）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.queryByText("Required")).toBeInTheDocument();
    });
  });

  it("create host: domain error（Please specify 80 characters or less）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: {
        value: "a11111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.queryByText("Please specify 80 characters or less")).toBeInTheDocument();
    });
  });

  it("create host: correct domain（=80 characters）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: {
        value: "a111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      const formatError = screen.queryAllByText("Please specify 80 characters or less");
      expect(formatError.length).toBe(0);
    });
  });

  it("create host: domain error（Including double-byte characters）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "abc１２３" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Including Uppercase）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "ABC-123" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: domain error（Including other symbols）", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "ab@123" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("create host: correct domain", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByPlaceholderText("trial"), {
      target: { value: "abc-12223" },
    });

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      const formatError = screen.queryAllByText(
        "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
      );
      expect(formatError.length).toBe(0);
    });
  });

  it("create host: the plan is CUSTOM", async () => {
    const mockAxios = new MockAdapter(axios);
    const getMansionsUrl = new RegExp("/api/curd/Mansion*");
    mockAxios.onGet(getMansionsUrl).reply(
      200,
      [
        { ...mockMansion, id: "test-host-create-form-01" },
        { ...mockMansion, id: "test-host-create-form-02" },
      ],
      {
        "Content-Type": "application/json",
        "Access-Control-Expose-Headers": "Content-Range",
        "content-range": `items 0-2/2`,
      }
    );

    const getHostsUrl = new RegExp("/api/curd/Customers*");
    mockAxios.onGet(getHostsUrl).reply(200, [], {
      "Content-Type": "application/json",
      "Access-Control-Expose-Headers": "Content-Range",
      "content-range": `items 0-0/0`,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <HostCreateForm />
      </QueryClientProvider>
    );

    const mansion = {
      ...mockMansion,
      id: "test-host-create-form-01",
      domain: "wonderfulapp.dev",
    };

    const host = {
      mansion,
      plan: "CUSTOM",
      selectedFeatures: ["CROSS_ANALYSIS"],
    };

    fireEvent.change(screen.getByLabelText("mansion"), {
      target: { value: JSON.stringify(mansion) },
    });

    fireEvent.change(screen.getByLabelText("cname"), {
      target: { value: "jiang-test" },
    });

    expect(screen.queryByLabelText("selectedFeatures")).toBeNull();

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "CUSTOM" },
    });

    expect(screen.queryByLabelText("selectedFeatures")).toBeInTheDocument();
    fireEvent.click(screen.getByText("クロス分析"));

    fireEvent.click(screen.getByText("Save"));

    const postHostURL = new RegExp("/api/curd/Customers/");
    mockAxios.onPost(postHostURL, expect.objectContaining(host));
  });
});
