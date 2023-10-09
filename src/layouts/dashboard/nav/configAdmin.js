// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <img src={`/assets/icons/navbar/${name}.gif`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/user/dashboard',
    icon: icon('chart'),
  },
  {
    title: 'Ads',
    path: '/user/ads',
    icon: icon('ad'),
  },
  {
    title: 'Add Ad',
    path: '/user/add',
    icon: icon('doc'),
  },
  
];

export default navConfig;
