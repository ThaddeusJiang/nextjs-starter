import { mockHost, mockMansion, mockTask } from "data/mocks";
import { rest } from "msw";

const handlers = [
  rest.get("/api/customers", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    // const isAuthenticated = sessionStorage.getItem("is-authenticated");
    // if (!isAuthenticated) {
    //   // If not authenticated, respond with a 403 error
    //   return res(
    //     ctx.status(403),
    //     ctx.json({
    //       errorMessage: "Not authorized",
    //     })
    //   );
    // }
    console.debug("/customers");
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          {
            id: 1,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 2,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 3,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 4,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 5,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
        ],
      })
    );
  }),
  rest.get("/api/jobs", (req, res, ctx) => {
    // Check if the user is authenticated in this session
    // const isAuthenticated = sessionStorage.getItem("is-authenticated");
    // if (!isAuthenticated) {
    //   // If not authenticated, respond with a 403 error
    //   return res(
    //     ctx.status(403),
    //     ctx.json({
    //       errorMessage: "Not authorized",
    //     })
    //   );
    // }
    console.debug("jobs");

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          {
            id: 1,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 2,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 3,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 4,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
          {
            id: 5,
            name: "Jane Cooper",
            title: "Regional Paradigm Technician",
            department: "Optimization",
            role: "Admin",
            email: "jane.cooper@example.com",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
          },
        ],
      })
    );
  }),
  rest.get("/api/curd/Tasks/", (req, res, ctx) => {
    const randomTasks = Array.from({ length: 10 }, () => {
      const randomId = Math.floor(Math.random() * 100);
      const randomState = Math.random() > 0.5 ? "failed" : "succeeded";
      return {
        ...mockTask,
        id: randomId,
        state: randomState,
      };
    });

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "application/json"),
      ctx.set("Content-Range", "tasks 0-9/10"),
      ctx.json(randomTasks)
    );
  }),
  rest.get("/api/curd/Mansions/", (req, res, ctx) => {
    const randomMansions = Array.from({ length: 10 }, () => ({
      ...mockMansion,
      id: `mansion ${Math.floor(Math.random() * 100)}`,
    }));

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "application/json"),
      ctx.set("Content-Range", "mansions 0-9/10"),
      ctx.json(randomMansions)
    );
  }),
  rest.get("/api/curd/Mansions/:id", (req, res, ctx) => {
    console.debug("mansion");
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "application/json"),

      ctx.json(mockMansion)
    );
  }),

  rest.get("/api/curd/Customers/", (req, res, ctx) => {
    const randomHosts = Array.from({ length: 10 }, () => ({
      ...mockHost,
      id: `host ${Math.floor(Math.random() * 100)}`,
    }));

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "application/json"),
      ctx.set("Content-Range", "hosts 0-9/10"),
      ctx.json(randomHosts)
    );
  }),

  rest.get("/api/curd/Customers/:id", (req, res, ctx) => {
    console.debug("host");
    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.set("Content-Type", "application/json"),

      ctx.json(mockHost)
    );
  }),
];
export default handlers;
