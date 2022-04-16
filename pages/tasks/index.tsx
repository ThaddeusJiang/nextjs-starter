import { useRouter } from "next/dist/client/router";
import { FC, useMemo } from "react";
import classNames from "classnames";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import omitBy from "lodash/omitBy";

import { omit } from "lodash";
import { findTasks } from "../../modules/task/apis/task";
import DataTable from "../../components/DataTable/DataTable";
import DataTableTabs from "../../components/DataTable/DataTableTabs";
import { DataTableLinkCell } from "../../components/DataTable/DataTableLinkCell";
import { safeJSONparse } from "../../utils/json";
import { DataTableDateCell } from "../../components/DataTable/DataTableDateCell";
import Loading from "../../components/Loading";
import DataNotFound from "../../components/DataNotFound/DataNotFound";

type TabInfoType = {
  name: string;
  href: string;
};

type FilterInfosType = {
  state?: string;
  "host LIKE"?: string;
  "scheduledStartedAt >"?: string;
  "scheduledStartedAt <="?: string;
};

type FormSearchData = {
  startAt: string;
  endAt: string;
  host: string;
};

export const formatParmas = (data: FormSearchData, filter) => {
  const { host, startAt, endAt } = data;
  let routerQuery = { ...filter };
  routerQuery = safeJSONparse(routerQuery.filter) || {};
  routerQuery["scheduledStartedAt >"] = startAt ? dayjs(startAt).startOf("day").toISOString() : "";
  routerQuery["scheduledStartedAt <="] = endAt ? dayjs(endAt).endOf("day").toISOString() : "";
  routerQuery["host LIKE"] = host ? `%${host}%` : "";

  const formatFilterData = omitBy(routerQuery, (value) => value === "");
  const routeQuery = {
    ...filter,
    filter: JSON.stringify(formatFilterData),
  };
  return routeQuery;
};

export const generateTabInfos = (tabNames: string[], filterObj: FilterInfosType): TabInfoType[] =>
  tabNames.map((state) => {
    let tabInfo: TabInfoType = { name: state, href: "" };
    let needToKeepFilter = {};
    // 検索条件が存在する場合、state以外の検索条件を抽出
    if (filterObj) {
      const otherFilter = omit(filterObj, ["state"]);
      needToKeepFilter = { ...otherFilter };
    }
    // allではない場合、stateを検索条件に追加
    if (state !== "all") {
      needToKeepFilter = { ...needToKeepFilter, state };
    }
    // 検索条件がある場合のみ、検索条件を文字列に変換しhrefを更新
    if (Object.keys(needToKeepFilter).length) {
      tabInfo = { ...tabInfo, href: `?filter=${JSON.stringify(needToKeepFilter)}` };
    }
    return tabInfo;
  });

export const TAB_NAMES = ["all", "succeeded", "failed", "queued", "scheduled"];

const Tasks: FC<unknown> = () => {
  const router = useRouter();
  const filterString = router.query.filter as string;
  const sortString = router.query.sort as string;
  const page = parseInt(router.query.page as string, 10);
  const pageSize = parseInt(router.query.pageSize as string, 10);

  const query = useQuery(["tasks", { filterString, sortString, page, pageSize }], async () =>
    findTasks({
      filter: safeJSONparse(filterString),
      sort: safeJSONparse(sortString),
      offset: (page - 1) * pageSize || 0,
      limit: pageSize || 100,
    })
  );
  const currentFilterObj = safeJSONparse(filterString);
  const currentStateString = currentFilterObj?.state;
  // URLに下記対象検索情報が含まれている場合、検索情報を抽出
  const scheduledStartAt = currentFilterObj?.["scheduledStartedAt >"];
  const scheduledEndAt = currentFilterObj?.["scheduledStartedAt <="];

  const hostLike = currentFilterObj?.["host LIKE"];
  const hostKeyWord = hostLike ? hostLike.slice(1, -1) : "";

  const datePattern = new RegExp(/(\d{4}-\d{2}-\d{2})/);

  const { register, handleSubmit, reset } = useForm({
    // 対象検索情報をinput初期値として指定
    defaultValues: {
      // 時間文字列から日付部分のみ取得
      startAt: datePattern.exec(scheduledStartAt)?.[0],
      endAt: datePattern.exec(scheduledEndAt)?.[0],
      host: hostKeyWord,
    },
  });

  const parseTask = (res) => ({
    ...res,
    triggeredBy: res.type,
  });

  const columns = useMemo(
    () => [
      {
        Header: "name",
        accessor: "name",
        Cell: (data) => (
          <DataTableLinkCell
            // eslint-disable-next-line react/destructuring-assignment
            link={`/tasks/${data.row.original.id}`}
            // eslint-disable-next-line react/destructuring-assignment
            text={data.cell.value}
          />
        ),
      },
      {
        Header: "host",
        accessor: "host",
      },
      {
        Header: "state",
        accessor: "state",
        Cell: ({ cell: { value } }) => (
          <span
            className={classNames({
              "badge badge-lg badge-success": value === "succeeded",
              "badge badge-lg badge-ghost": value === "queued",
              "badge badge-lg badge-error": value === "failed",
              "badge badge-lg badge-warning": value === "scheduled",
            })}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "scheduledStartedAt",
        accessor: "scheduledStartedAt",
        Cell: ({ cell: { value } }) => <DataTableDateCell value={value} />,
      },
      {
        Header: "start",
        accessor: "start",
        Cell: ({ cell: { value } }) => <DataTableDateCell value={value} />,
      },
      {
        Header: "end",
        accessor: "end",
        Cell: ({ cell: { value } }) => <DataTableDateCell value={value} />,
      },
      {
        Header: "triggeredBy",
        accessor: "triggeredBy",
      },
      {
        Header: "message",
        accessor: "message",
      },
    ],
    []
  );

  const submit = (data: FormSearchData) => {
    const routeQuery = formatParmas(data, router.query as FormSearchData);
    router.push({
      query: routeQuery,
    });
  };

  return (
    <>
      <div className="px-4 py-4 sm:px-0 flex justify-between">
        <h1 className="text-3xl font-extrabold text-white">Tasks</h1>
      </div>

      <div className=" sm:flex sm:justify-between sm:bg-white">
        <DataTableTabs
          items={generateTabInfos(TAB_NAMES, currentFilterObj)}
          value={currentStateString ?? "all"}
        />
      </div>

      <div className="py-4 sm:px-4 sm:bg-white">
        <form className="sm:flex sm:items-end sm:space-x-4" onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
            <div className="flex w-full sm:w-auto flex-col ">
              <label htmlFor="host" className="label mr-2">
                Host:
              </label>
              <input
                id="host"
                type="text"
                className="w-full sm:w-auto input input-bordered"
                placeholder="Search host"
                {...register("host")}
              />
              <input type="submit" className="hidden" />
            </div>
            <div className="flex w-full sm:w-auto flex-col ">
              <label htmlFor="startAt" className="label mr-2">
                Scheduled started at:
              </label>
              <input
                id="startAt"
                type="date"
                className="w-full sm:w-auto input input-bordered"
                placeholder="Select a date"
                {...register("startAt")}
              />
            </div>
            <div className="flex w-full sm:w-auto flex-col ">
              <label htmlFor="endAt" className="label mr-2">
                Scheduled ended at:
              </label>
              <input
                id="endAt"
                type="date"
                className="w-full sm:w-auto input input-bordered"
                placeholder="Select a date"
                {...register("endAt")}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between space-y-4 space-x-4 sm:flex-auto">
            <button type="submit" className="btn btn-outline">
              Search
            </button>
            <button
              type="submit"
              className="link self-end"
              onClick={() => {
                reset({
                  host: "",
                  startAt: null,
                  endAt: null,
                });
              }}
            >
              Reset filters
            </button>
          </div>
        </form>
      </div>
      <div className="w-full sm:bg-white">
        {query.isLoading ? (
          <div className="text-center h-screen-sm ">
            <Loading />
          </div>
        ) : (
          <>
            {query.data?.items?.length ? (
              <DataTable
                columns={columns}
                data={(query.data?.items || []).map(parseTask)}
                pageCount={Math.ceil(query.data?.total / pageSize)}
                total={query.data?.total}
              />
            ) : (
              <DataNotFound description="We don't support creating task at this moment." />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Tasks;
