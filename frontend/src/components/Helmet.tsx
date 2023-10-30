import { Helmet as ReactHelmet } from 'react-helmet';
import type { HelmetProps } from '../types/Helmet';

const Helmet = ({ title, description }: HelmetProps) => (
  <ReactHelmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={window.location.href} />
  </ReactHelmet>
);

export default Helmet;
