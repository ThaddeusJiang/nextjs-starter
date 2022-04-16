import { FC } from "react";

import { dateFormat } from "utils/date";

type Props = {
  value: string;
};

export const DataTableDateCell: FC<Props> = (props) => {
  const { value } = props;

  return <span>{dateFormat(value)}</span>;
};
