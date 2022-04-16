import dayjs from "dayjs";

export const CommonFormat = "YYYY-MM-DD HH:mm:ss Z";

export const dateFormat = (value: string): string =>
  value ? dayjs(value).format(CommonFormat) : "";
