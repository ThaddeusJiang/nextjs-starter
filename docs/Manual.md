# Manual

运用手册

- [Manual](#manual)
  - [如果某天 tasks 创建，如何修复？](#如果某天-tasks-创建如何修复)
  - [如果某些 tasks 未成功运行（state: scheduled, queued, failed），如何修复？](#如果某些-tasks-未成功运行state-scheduled-queued-failed如何修复)
  - [TaskDefinitions](#taskdefinitions)
  - [Sample Data API](#sample-data-api)

## 如果某天 tasks 创建，如何修复？

请使用任意 HTTP client 工具，调用下面 API

```
GET https://xxx.app/api/manualScheduleTasks/?code=
```

参数：

```
code: Azure Function key，请通过 Azure Portal 获取
```

返回值：

```js
{
  tasks: []string // tasks id 集合
}
```

## 如果某些 tasks 未成功运行（state: scheduled, queued, failed），如何修复？

未提供方法。

TODO:

## TaskDefinitions


## Sample Data API

TODO:

1. yy
2. yy
3. yy
