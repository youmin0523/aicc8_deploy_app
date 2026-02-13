import {
  MdHome,
  MdFactCheck,
  MdWatchLater,
  MdCalendarMonth,
  MdRocketLaunch,
} from 'react-icons/md';
import { AiFillExclamationCircle } from 'react-icons/ai';

export const navMenus = [
  { label: 'Home', to: '/', icon: <MdHome className="w-5 h-5" />, idx: 0 },
  {
    label: 'Completed',
    to: '/completed',
    icon: <MdFactCheck className="w-5 h-5" />,
    idx: 1,
  },
  {
    label: 'Proceeding',
    to: '/proceeding',
    icon: <MdWatchLater className="w-5 h-5" />,
    idx: 2,
  },
  {
    label: 'Important',
    to: '/important',
    icon: <AiFillExclamationCircle className="w-5 h-5" />,
    idx: 3,
  },
  {
    label: 'V2 Evolution',
    to: '/v2',
    icon: <MdRocketLaunch className="w-5 h-5 text-blue-400" />,
    idx: 4,
  },
  {
    label: 'Calendar V2',
    to: '/v2/calendar',
    icon: <MdCalendarMonth className="w-5 h-5 text-purple-400" />,
    idx: 5,
  },
];
