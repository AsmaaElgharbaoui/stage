import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  
  {
    title: 'user',
    path: '/',
    icon: icon('ic_user'),
  },
  {
    title: 'dashboard',
    path: '/user',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Room',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Appointments',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'logout',
    path: '/',
    icon: icon('ic_lock'),
  },
];

export default navConfig;

