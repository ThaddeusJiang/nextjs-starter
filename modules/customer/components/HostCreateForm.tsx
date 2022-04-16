import * as yup from "yup";

import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { DevTool } from "@hookform/devtools";
import SectionLoading from "components/Loading/SectionLoading";
import { safeJSONparse } from "utils/json";
import toast from "react-hot-toast";
import { useRouter } from "next/dist/client/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { PricePlans, SelectedFeatures } from "data/real";
import { createHost, findHosts } from "../apis/host";
import { findMansions } from "../apis/mansion";

const MAX_MANSION_HOSTS = 20;

const schema = yup.object().shape({
  mansion: yup.string().required("Required"),
  cname: yup
    .string()
    .required("Required")
    .matches(
      /^[a-z]+(-|[a-z0-9])*$/,
      "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
    )
    .max(80, "Please specify 80 characters or less"),
  plan: yup.string().required("Required"),
  selectedFeatures: yup.array().of(yup.string()),
  memo: yup.string(),
});

type CreateHostSchema = {
  mansion: string;
  cname: string;
  plan: string;
  selectedFeatures?: string[];
  memo: string;
};

function PreviewHost({ control }) {
  // doc: https://react-hook-form.com/api/usewatch
  const formValues = useWatch({
    control,
  });

  const mansion = safeJSONparse(formValues.mansion);

  return formValues.mansion ? (
    <>
      <label htmlFor="preview" className="label">
        preview
      </label>

      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">host:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {`${formValues?.cname}.${mansion?.domain}`}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">databaseName:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {mansion?.databaseId}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">collectionName:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {`Data_${formValues.cname}`}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">storagePrefix:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formValues.cname}</dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">frontdoorName:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {mansion.frontDoorName}
            </dd>
          </div>
        </dl>
      </div>
    </>
  ) : (
    <div />
  );
}

export const FeaturesCheckboxs = ({ control, register }) => {
  const plan = useWatch({
    control,
    name: "plan",
  });

  return plan === "CUSTOM" ? (
    <div className="col-span-6 sm:col-span-3 ">
      <label htmlFor="selectedFeatures" className="label">
        selectedFeatures
      </label>
      {SelectedFeatures.map((feature) => (
        <div key={feature.value} className="form-control">
          <label className="label cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              id="selectedFeatures"
              {...register("selectedFeatures")}
              className="checkbox checkbox-sm"
              value={feature.value}
            />
            <span className="label-text">{feature.label}</span>
          </label>
        </div>
      ))}
    </div>
  ) : (
    <div className="col-span-6 sm:col-span-3 " />
  );
};

const HostCreateForm = () => {
  const queryMansions = useQuery("mansions", async () => {
    const mansions = await findMansions({});
    return mansions;
  });

  const router = useRouter();

  const createHostMutation = useMutation(
    async ({
      mansionId,
      cname,
      plan,
      memo,
      selectedFeatures,
    }: {
      mansionId: string;
      cname: string;
      plan: string;
      memo: string;
      selectedFeatures: string[];
    }) => {
      const id = await createHost({ mansionId, cname, plan, memo, selectedFeatures });
      return id;
    },
    {
      onSuccess: async (id) => {
        toast.success("Success");
        router.push(`/hosts/${id}`);
      },
    }
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateHostSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      cname: "",
      mansion: "",
      plan: "TRIAL",
      selectedFeatures: [],
      memo: "",
    },
  });

  const onSubmit = (d) => {
    const mansion = safeJSONparse(d.mansion);
    const { cname, plan, memo, selectedFeatures } = d;

    createHostMutation.mutate({
      mansionId: mansion.id,
      cname,
      plan,
      memo,
      selectedFeatures: plan === "CUSTOM" ? selectedFeatures : [],
    });
  };
  const watchMansion = watch("mansion");
  const queryHostsCount = useQuery(`mansion-${watchMansion}-hosts`, async () => {
    if (!watchMansion) {
      return 0;
    }
    const mansion = JSON.parse(watchMansion);
    if (!mansion.id) {
      throw new Error("The mansion object is missing id field");
    }
    const filter = {
      "mansion.id": mansion.id,
    };
    const hosts = await findHosts({
      filter,
    });
    return hosts.total;
  });
  const isExceeded =
    !queryHostsCount.isLoading &&
    typeof queryHostsCount.data === "number" &&
    queryHostsCount.data >= MAX_MANSION_HOSTS;
  return (
    <>
      <DevTool control={control} />
      <form className=" relative" onSubmit={handleSubmit(onSubmit)}>
        {createHostMutation.isLoading && (
          <SectionLoading message="It will take long time, You are free to leave." />
        )}
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Information</h3>
            </div>

            <div className="grid grid-cols-6 gap-4 form-control">
              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="mansion" className="label">
                  mansion
                </label>
                <select
                  id="mansion"
                  className="select select-bordered"
                  placeholder="mansion"
                  {...register("mansion")}
                >
                  <option disabled value="">
                    -- select mansion --
                  </option>
                  {(queryMansions.data?.items || []).map((item) => (
                    <option key={item.id} value={JSON.stringify(item)}>
                      {item.id}
                    </option>
                  ))}
                </select>
                {errors.mansion && (
                  <p role="alert" className="text-red-700">
                    {errors.mansion.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="cname" className="label">
                  cname
                </label>
                <input
                  id="cname"
                  className="input input-bordered"
                  placeholder="trial"
                  {...register("cname")}
                />
                {errors.cname && (
                  <p role="alert" className="text-red-700">
                    {errors.cname.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="plan" className="label">
                  plan
                </label>
                <select
                  id="plan"
                  className=" select select-bordered"
                  placeholder="plan"
                  {...register("plan")}
                >
                  {PricePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
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
                  className="textarea textarea-bordered"
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

              <div className="col-span-6">
                <PreviewHost control={control} />
              </div>
            </div>
          </div>

          {isExceeded && (
            <div className="py-2 px-4 bg-gray-50 sm:px-6">
              Hosts of this mansion are exceeded 20, please create a new mansion
            </div>
          )}
          {queryHostsCount.error && (
            <div className="count-error py-2 px-4 bg-gray-50 sm:px-6">
              Failed to fetch hosts list of the mansion.
            </div>
          )}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={
                createHostMutation.isLoading ||
                queryHostsCount.isLoading ||
                queryHostsCount.data >= MAX_MANSION_HOSTS
              }
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostCreateForm;
