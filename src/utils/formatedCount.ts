const formatedCount = (score: number) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default formatedCount;
