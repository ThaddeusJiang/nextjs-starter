import * as yup from "yup";

import { FC, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import { DevTool } from "@hookform/devtools";
import { Host } from "types";
import Loading from "components/Loading";
import SectionLoading from "components/Loading/SectionLoading";
import Tippy from "@tippyjs/react";
import { omit, pick } from "lodash";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/dist/client/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { DocumentTextIcon, ClipboardCheckIcon } from "@heroicons/react/outline";
import SideMenu from "components/SideMenu/";
import { PricePlans } from "data/real";
import HostStateSteps from "./HostStateSteps";
import HostInitialAccountView from "./HostInitialAccountView";
import { confirmHost, deleteHost, initSampleData, updateHost } from "../apis/host";
import { FeaturesCheckboxs } from "./HostCreateForm";

type Props = {
  host: Host;
};

const schema = yup.object().shape({
  plan: yup.string().required(),
  selectedFeatures: yup.array().of(yup.string()),
  connectionString: yup.string(),
  storageConnectionString: yup.string(),
  collectionName: yup
    .string()
    .required("Required")
    .matches(
      /^Data_[a-z]+(-|[a-z0-9])*$/,
      "Please enter a string starting with Data_ followed by half-width alphanumeric characters, which can contain numbers and hyphen"
    )
    .max(80, "Please specify 80 characters or less"),
  storagePrefix: yup
    .string()
    .required("Required")
    .matches(
      /^[a-z]+(-|[a-z0-9])*$/,
      "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
    )
    .max(80, "Please specify 80 characters or less"),
  xApiToken: yup.string(),
  memo: yup.string(),
  databaseName: yup.string(),
});

const HostUpdateForm: FC<Props> = (props) => {
  const { host } = props;

  const {
    id: hostId,
    plan,
    selectedFeatures,
    connectionString,
    storageConnectionString,
    collectionName,
    storagePrefix,
    xApiToken,
    memo,
    databaseName,
  } = host;

  const menuList = [
    {
      name: "Status",
      icon: <ClipboardCheckIcon />,
      linkId: "status",
    },
    {
      name: "Information",
      icon: <DocumentTextIcon />,
      linkId: "information",
    },
  ];

  const router = useRouter();
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const showConfirm = () => setVisibleConfirm(true);
  const hideConfirm = () => setVisibleConfirm(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
  } = useForm<Host>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: hostId,
      plan,
      selectedFeatures,
      connectionString,
      storageConnectionString,
      collectionName,
      storagePrefix,
      xApiToken,
      memo,
      databaseName,
    },
  });

  const queryClient = useQueryClient();

  const updateHostMutation = useMutation(updateHost, {
    onSuccess: async () => {
      await toast.success("Host updated");
      queryClient.refetchQueries(["hosts", hostId]);
      router.push("/hosts");
    },
  });

  const initSampleDataMutation = useMutation(initSampleData, {
    onSuccess: async () => {
      await toast.success("Succeed");
    },
    onError: async () => {
      await toast.error("Failed for init sample data!");
    },
  });

  const onSubmit = (d) => {
    const updatedValues = pick(d, Object.keys(dirtyFields));
    const values = d.plan === "CUSTOM" ? updatedValues : omit(updatedValues, ["plan"]);
    updateHostMutation.mutate({ id: hostId, ...values });
  };

  const deleteMutation = useMutation(deleteHost, {
    onSuccess: () => {
      toast.success("Host deleted");
      router.push("/hosts");
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const onDelete = async (id) => {
    await deleteMutation.mutate(id);
    hideConfirm();
  };

  const confirmHostMutation = useMutation(confirmHost, {
    onSuccess: async () => {
      toast.success("Confirmed Success");
      queryClient.refetchQueries(["hosts", hostId]);
    },
  });

  const onConfirm = async (id) => {
    await confirmHostMutation.mutate(id);
  };

  return (
    <>
      <DevTool control={control} />
      <div className="block sm:flex ">
        <div className="w-full sm:w-60 mb-4 grow-0 shrink-0 sm:mr-4 sm:mb-0">
          <SideMenu menuList={menuList} />
        </div>
        <form className="grow relative" onSubmit={handleSubmit(onSubmit)}>
          <div id="status" className="mb-4 shadow sm:rounded-md sm:overflow-hidden relative">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Status</h3>
              </div>
              <HostStateSteps host={host} />
              {["creating", "created", "publishing"].includes(host.state) ? (
                <SectionLoading message="The host is in progress, try it later please." />
              ) : (
                <>
                  {host.state !== "confirmed" && (
                    <>
                      <div className="relative min-h-xs">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Sample Data
                        </h3>
                        <div className="">
                          <button
                            type="button"
                            disabled={updateHostMutation.isLoading}
                            onClick={() => initSampleDataMutation.mutate(host)}
                            className="btn "
                          >
                            {initSampleDataMutation.isLoading ? <Loading /> : "initialize "}
                          </button>
                          {initSampleDataMutation.isSuccess && (
                            <div className="my-2 text-success">Successful initialized</div>
                          )}
                          {initSampleDataMutation.isError && (
                            <div className="my-2 text-error">Failed to initialize</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          Initial Account
                        </h3>
                        <HostInitialAccountView host={host} />
                        <button
                          type="button"
                          onClick={() => onConfirm(hostId)}
                          disabled={confirmHostMutation.isLoading}
                          className="btn mt-4 btn-primary"
                        >
                          confirm
                        </button>
                        <p className="label">
                          <span className="label-text-alt">
                            If you have confirmed the host, click it. (we will hide the initial
                            email and password for security.)
                          </span>
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          {(updateHostMutation.isLoading || deleteMutation.isLoading) && <SectionLoading />}
          <div id="information" className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Information</h3>
              </div>

              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6 sm:col-span-3" />

                <div className="col-span-6 sm:col-span-3" />

                <div className="col-span-6 sm:col-span-3 form-control">
                  <label htmlFor="domain" className="label">
                    domain
                  </label>
                  <input
                    id="domain"
                    className="input input-bordered"
                    placeholder="???.wonderfulapp.work"
                    readOnly
                    {...register("id")}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3" />

                <div className="col-span-6 sm:col-span-3 form-control	">
                  <label htmlFor="plan" className="label">
                    plan
                  </label>
                  <select
                    id="plan"
                    className="select select-bordered w-full"
                    placeholder="plan"
                    {...register("plan")}
                  >
                    {PricePlans.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.plan && (
                    <p role="alert" className="text-red-700">
                      {errors.plan.message}
                    </p>
                  )}
                </div>

                <FeaturesCheckboxs control={control} register={register} />

                <div className="col-span-6 sm:col-span-3 form-control">
                  <label htmlFor="memo" className="label">
                    memo
                  </label>
                  <textarea
                    id="memo"
                    className="textarea textarea-bordered w-full"
                    {...register("memo")}
                    placeholder="The host is used for ..."
                    rows={3}
                  />

                  {errors.memo && (
                    <p role="alert" className="text-red-700">
                      {errors.memo.message}
                    </p>
                  )}
                </div>

                <div className="col-span-3 " />

                <div className="col-span-6 sm:col-span-3 form-control">
                  <label htmlFor="connectionString" className="label">
                    connectionString
                  </label>
                  <input
                    id="connectionString"
                    className="input input-bordered"
                    placeholder="*** *** *** *** *** *** *** ***"
                    {...register("connectionString")}
                  />

                  {errors.connectionString && (
                    <p role="alert" className="text-red-700">
                      {errors.connectionString.message}
                    </p>
                  )}
                </div>
                <div className="col-span-3 " />

                <div className="col-span-6 sm:col-span-3 form-control">
                  <label htmlFor="databaseName" className="label">
                    databaseName
                  </label>
                  <input
                    id="databaseName"
                    className="input input-bordered"
                    placeholder="funnyapp-000n"
                    {...register("databaseName")}
                  />

                  {errors.databaseName && (
                    <p role="alert" className="text-red-700">
                      {errors.databaseName.message}
                    </p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3 form-control">
                  <label htmlFor="collectionName" className="label">
                    collectionName
                  </label>
                  <input
                    id="collectionName"
                    data-testid="collectionName"
                    className="input input-bordered"
                    {...register("collectionName")}
                  />

                  {errors.collectionName && (
                    <p role="alert" className="text-red-700">
                      {errors.collectionName.message}
                    </p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3  form-control">
                  <label htmlFor="storageConnectionString" className="label">
                    storageConnectionString
                  </label>
                  <input
                    id="storageConnectionString"
                    className="input input-bordered"
                    placeholder="*** *** *** *** *** *** *** ***"
                    {...register("storageConnectionString")}
                  />

                  {errors.storageConnectionString && (
                    <p role="alert" className="text-red-700">
                      {errors.storageConnectionString.message}
                    </p>
                  )}
                </div>
                <div className="col-span-3 " />

                <div className="col-span-6 sm:col-span-3  form-control">
                  <label htmlFor="storagePrefix" className="label">
                    storagePrefix
                  </label>
                  <input
                    id="storagePrefix"
                    data-testid="storagePrefix"
                    className="input input-bordered"
                    {...register("storagePrefix")}
                  />

                  {errors.storagePrefix && (
                    <p role="alert" className="text-red-700">
                      {errors.storagePrefix.message}
                    </p>
                  )}
                </div>

                <div className="col-span-6 form-control">
                  <label htmlFor="xApiToken" className="label">
                    xApiToken
                  </label>
                  <input
                    id="xApiToken"
                    className="input input-bordered"
                    placeholder="*** *** *** *** *** *** *** ***"
                    {...register("xApiToken")}
                  />

                  {errors.xApiToken && (
                    <p role="alert" className="text-red-700">
                      {errors.xApiToken.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right space-x-4">
                <Tippy
                  visible={visibleConfirm}
                  onClickOutside={hideConfirm}
                  className="shadow-2xl rounded-lg bg-white text-center　px-4 py-2"
                  content={
                    <div className="">
                      <p className="pb-2">Do you want delete it?</p>

                      <div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            name="deleteButtonCancel"
                            className="btn btn-xs "
                            onClick={hideConfirm}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            name="deleteButtonConfirm"
                            className="btn btn-xs btn-error"
                            onClick={() => {
                              onDelete(hostId);
                            }}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                  interactive
                  allowHTML
                  placement="top-end"
                  arrow
                >
                  <button
                    disabled={deleteMutation.isLoading}
                    type="button"
                    name="deleteButton"
                    className="btn btn-error"
                    onClick={visibleConfirm ? hideConfirm : showConfirm}
                  >
                    delete
                  </button>
                </Tippy>
                <button
                  disabled={updateHostMutation.isLoading}
                  type="submit"
                  className="btn btn-primary"
                >
                  save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default HostUpdateForm;
