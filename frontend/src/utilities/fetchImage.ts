const fetchImage = async (img: string, setState?: React.Dispatch<React.SetStateAction<string>>) => {
  const response = await import(`../images/market/${img}`);
  if (setState) {
    return setState(response.default);
  }
  return response.default;
};

export default fetchImage;
