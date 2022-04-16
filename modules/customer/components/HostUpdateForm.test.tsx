import "@testing-library/jest-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { HostState } from "types";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { mockHost } from "data/mocks";
import HostUpdateForm from "./HostUpdateForm";

const queryClient = new QueryClient();
describe("HostUpdateForm", () => {
  test("should show selectedFeatures when the plan is CUSTOM", () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "CUSTOM" },
    });

    expect(screen.getByLabelText("selectedFeatures")).toBeInTheDocument();

    fireEvent.click(screen.getByText("クロス分析"));
    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
        selectedFeatures: ["CROSS_ANALYSIS"],
      })
    );
  });

  test("host detail form: should update host, initSampleData", () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );
  });

  test("should have and initialize button and confirm button  ", () => {
    const host = { ...mockHost, id: "test-host-detail-form-01", state: "published" as HostState };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    expect(screen.getByRole("button", { name: "initialize" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "confirm" })).toBeTruthy();
  });

  test("shouldn't have and initialize button and confirm button  ", () => {
    const host = { ...mockHost, id: "test-host-detail-form-01", state: "confirmed" as HostState };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    expect(screen.queryByRole("button", { name: "initialize" })).toBeFalsy();
    expect(screen.queryByRole("button", { name: "confirm" })).toBeFalsy();
  });

  test("shouldn't have and initialize button and confirm button  ", () => {
    const host = { ...mockHost, id: "test-host-detail-form-01", state: "confirmed" as HostState };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    expect(screen.queryByRole("button", { name: "initialize" })).toBeFalsy();
    expect(screen.queryByRole("button", { name: "confirm" })).toBeFalsy();
  });

  test("collectionName error (Required)", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(screen.queryByText("Required")).toBeInTheDocument();
    });
  });

  test("collectionName error（Illegal collectionName）： Start from numbers", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "123abc" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with Data_ followed by half-width alphanumeric characters, which can contain numbers and hyphen"
        )
      ).toBeInTheDocument();
    });
  });

  test("collectionName error（Illegal collectionName）： Including double-byte characters", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc１２３" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with Data_ followed by half-width alphanumeric characters, which can contain numbers and hyphen"
        )
      ).toBeInTheDocument();
    });
  });

  test("collectionName error（Illegal collectionName）： Including other symbols", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc123@" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with Data_ followed by half-width alphanumeric characters, which can contain numbers and hyphen"
        )
      ).toBeInTheDocument();
    });
  });

  test("collectionName error（Please specify 80 characters or less）", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: {
        value:
          "Data_a111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(screen.queryByText("Please specify 80 characters or less")).toBeInTheDocument();
    });
  });

  test("correct collectionName（=80 characters）", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: {
        value: "Data_a11111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      const formatError = screen.queryAllByText("Please specify 80 characters or less");
      expect(formatError.length).toBe(0);
    });
  });

  test("correct collectionName", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      const formatError = screen.queryAllByText(
        "Please enter a string starting with Data_ followed by half-width alphanumeric characters, which can contain numbers and hyphen"
      );
      expect(formatError.length).toBe(0);
    });
  });

  test("storagePrefix error（Illegal storagePrefix）： Start from numbers", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: { value: "123abc" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  test("storagePrefix error（Illegal storagePrefix）： Including double-byte characters", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: { value: "abc１２３" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  it("storagePrefix error（Including Uppercase）", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: { value: "ABC123" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  test("storagePrefix error（Illegal storagePrefix）： Including other symbols", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: { value: "abc@122" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
        )
      ).toBeInTheDocument();
    });
  });

  test("storagePrefix error（Please specify 80 characters or less）", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: {
        value: "a11111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(screen.queryByText("Please specify 80 characters or less")).toBeInTheDocument();
    });
  });

  test("correct storagePrefix（=80 characters）", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: {
        value: "a1111111111111111111111111111111111111111111111111111111111111111111111111111111",
      },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      const formatError = screen.queryAllByText("Please specify 80 characters or less");
      expect(formatError.length).toBe(0);
    });
  });

  test("storagePrefix error (Required)", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      expect(screen.queryByText("Required")).toBeInTheDocument();
    });
  });

  test("correct storagePrefix", async () => {
    const mockAxios = new MockAdapter(axios);

    const host = { ...mockHost, id: "test-host-detail-form-01" };

    render(
      <QueryClientProvider client={queryClient}>
        <HostUpdateForm host={host} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText("plan"), {
      target: { value: "TRIAL" },
    });

    fireEvent.change(screen.getByTestId("collectionName"), {
      target: { value: "Data_abc-123" },
    });

    fireEvent.change(screen.getByTestId("storagePrefix"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByText("save"));

    const updateHostUrl = new RegExp("/api/curd/Customers/");
    mockAxios.onPut(
      updateHostUrl,
      expect.objectContaining({
        ...host,
        plan: "TRIAL",
      })
    );

    await waitFor(() => {
      const formatError = screen.queryAllByText(
        "Please enter a string starting with Data_ and can contain half-width alphanumeric characters, hyphen and number"
      );
      expect(formatError.length).toBe(0);
    });
  });
});
