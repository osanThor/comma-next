import dayjs from "dayjs";

const formatedDate = (dateString: string, format = "YYYY.MM.DD") => {
  return dayjs(dateString).format(format);
};

export default formatedDate;
