export const mockMansion = {
  id: "mansion 1",
  connectionString: "",
  storageConnectionString: "",
  databaseId: "funnyapp",
  domain: "wonderfulapp.dev",
  frontDoorName: "funnyapp-dev",
};

export const mockHost = {
  plan: "TRIAL",
  connectionString: "",
  storageConnectionString: "",
  collectionName: "Data_test",
  storagePrefix: "test",
  mansion: {
    id: "test",
    connectionString: "",
    storageConnectionString: "",
    databaseId: "funnyapp",
    domain: "wonderfulapp.dev",
    frontDoorName: "funnyapp-dev",
  },
  xApiToken: "80f305ab-8470-4a38-9c8f-de3e34600068",
  _partition: "Customers",
  _rid: "5iYEAK4t+gHcTQAAAAAAAA==",
  _self: "dbs/5iYEAA==/colls/5iYEAK4t+gE=/docs/5iYEAK4t+gHcTQAAAAAAAA==/",
  _etag: '"15007802-0000-2300-0000-6177ccd30000"',
  _attachments: "attachments/",
  _ts: 1635241171,
};

export const mockTaskDefinition = {
  description: "毎日の自動計算とバッチ処理",
  cronExpression: "0 25 1 * * *",
  httpRequest: {
    body: {
      api: "/api/sheetcontents-v2/automaticcalculation/batch",
      method: "PUT",
    },
  },
  activated: true,
  _partition: "TaskDefinition",
  _rid: "5iYEAK4t+gGUOwAAAAAAAA==",
  _self: "dbs/5iYEAA==/colls/5iYEAK4t+gE=/docs/5iYEAK4t+gGUOwAAAAAAAA==/",
  _etag: '"680107de-0000-2300-0000-6163df070000"',
  _attachments: "attachments/",
  _ts: 1633935111,
};

export const mockTask = {
  state: "scheduled", // rewrite
  scheduledStartedAt: "", // rewrite
  host: "test.jiang.com", // rewrite
  name: "毎日の自動計算とバッチ処理 / cs.wonderfulapp.dev",
  definitionId: "2de3b4f7-e714-4d82-81e2-cc7701fcb293",
  type: "http",
  elapsed: 0,
  retryTimes: 0,

  httpRequest: {
    body: {
      url: "https://cs.wonderfulapp.dev/api/sheetcontents-v2/automaticcalculation/batch",
      method: "PUT",
    },
  },
  callbackUrl:
    "https://funnyapp-admin-dev.azurewebsites.net/api/callback/tasks/2a5b4b77-cf0c-42e5-8c5b-217194ab9d15",
  _partition: "Task",
  _rid: "5iYEAK4t+gHcTwAAAAAAAA==",
  _self: "dbs/5iYEAA==/colls/5iYEAK4t+gE=/docs/5iYEAK4t+gHcTwAAAAAAAA==/",
  _etag: '"7e00ad65-0000-2300-0000-617abafa0000"',
  _attachments: "attachments/",
  _ts: 1635433210,
};
