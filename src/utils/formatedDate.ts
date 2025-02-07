import dayjs from "dayjs";

const formatedDate = (dateString: string) => {
  return dayjs(dateString).format("YYYY.MM.DD");
};

export default formatedDate;
