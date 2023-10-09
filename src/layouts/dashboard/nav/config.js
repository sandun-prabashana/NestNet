// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <img src={`/assets/icons/navbar/${name}.gif`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/admin/dashboard',
    icon: icon('chart'),
  },
  {
    title: 'user',
    path: '/admin/user',
    icon: icon('use'),
  },
  {
    title: 'Ads',
    path: '/admin/ads',
    icon: icon('ad'),
  },
  {
    title: 'Ads',
    path: '/admin/audittrace',
    icon: icon('doc'),
  },
];

export default navConfig;
