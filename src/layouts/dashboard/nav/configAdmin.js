// component
import SvgColor from '../../../components/svg-color';
import ChartImage from '../../../images/assets/icons/navbar/chart.gif';
import AdImage from '../../../images/assets/icons/navbar/ad.gif';
import DocImage from '../../../images/assets/icons/navbar/doc.gif';




// ----------------------------------------------------------------------

const icon1 = (name) => <img src={ChartImage} sx={{ width: 1, height: 1 }} />;
const icon2 = (name) => <img src={AdImage} sx={{ width: 1, height: 1 }} />;
const icon3 = (name) => <img src={DocImage} sx={{ width: 1, height: 1 }} />;


const navConfig = [
  {
    title: 'dashboard',
    path: '/user/dashboard',
    icon: icon1('chart'),
  },
  {
    title: 'Ads',
    path: '/user/ads',
    icon: icon2('ad'),
  },
  {
    title: 'Add Ad',
    path: '/user/add',
    icon: icon3('doc'),
  },
  
];

export default navConfig;
