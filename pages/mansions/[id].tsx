import { useQuery } from "react-query";
import { useRouter } from "next/dist/client/router";
import { Mansion } from "types";
import MansionDetail from "components/MansionDetail";
import { readMansion } from "modules/customer/apis/mansion";

const MansionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const query = useQuery<Mansion, Error>(["mansions", id], async () => {
    if (id && id !== "new") {
      const data = await readMansion(id as string);
      return data;
    }
    return null;
  });

  if (query.isLoading) return "Loading...";

  if (query.error) return `An error has occurred: ${query.error.message}`;

  return <MansionDetail value={query.data} />;
};

export default MansionDetailPage;
