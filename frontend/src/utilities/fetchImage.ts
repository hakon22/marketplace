const fetchImage = async (img: string, callback: React.Dispatch<React.SetStateAction<string>>) => {
  const response = await import(`../images/market/${img}`);
  callback(response.default);
};

export default fetchImage;
