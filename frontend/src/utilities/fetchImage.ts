const { hostname } = window.location;

const fetchImage = async (img: string, setState?: React.Dispatch<React.SetStateAction<string>>) => {
  if (hostname === 'localhost') {
    const response = await import(`../images/market/${img}`);
    return setState ? setState(response.default) : response.default;
  }
  return setState ? setState(`${process.env.PUBLIC_URL}/static/media/${img}`) : `${process.env.PUBLIC_URL}/static/media/${img}`;
};

export default fetchImage;
