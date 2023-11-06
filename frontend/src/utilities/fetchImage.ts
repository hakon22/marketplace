const fetchImage = async (img: string, setState: React.Dispatch<React.SetStateAction<string>>) => {
  const response = await import(`../images/market/${img}`);
  setState(response.default);
};

export default fetchImage;
