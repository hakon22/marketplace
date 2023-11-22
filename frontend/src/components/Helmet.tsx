import { Helmet as ReactHelmet } from 'react-helmet';

type HelmetProps = {
  title: string;
  description: string;
}

const Helmet = ({ title, description }: HelmetProps) => (
  <ReactHelmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={window.location.href} />
  </ReactHelmet>
);

export default Helmet;
