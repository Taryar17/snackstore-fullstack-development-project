import {
  HomeIcon,
  CookieIcon,
  HamburgerMenuIcon,
  ExclamationTriangleIcon,
  PaperPlaneIcon,
  PlusIcon,
  ArrowLeftIcon,
  StarIcon,
  HeartIcon,
  GearIcon,
  DashboardIcon,
  ExitIcon,
  BookmarkIcon,
  LayoutIcon,
  BackpackIcon,
  LayersIcon,
  CubeIcon,
  HeartFilledIcon,
} from "@radix-ui/react-icons";
import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  CreditCardIcon,
  DollarSignIcon,
  EyeIcon,
  FolderIcon,
  LogOutIcon,
  MailIcon,
  MinusIcon,
  PhoneIcon,
  RefreshCwIcon,
  ShieldIcon,
  ShoppingBagIcon,
  TagIcon,
  TrashIcon,
  TrendingUpIcon,
  UploadIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
      />
    </svg>
  ),
  home: HomeIcon,
  cookie: CookieIcon,
  menu: HamburgerMenuIcon,
  exclamation: ExclamationTriangleIcon,
  paperplane: PaperPlaneIcon,
  plus: PlusIcon,
  arrowleft: ArrowLeftIcon,
  star: StarIcon,
  heart: HeartIcon,
  minus: MinusIcon,
  gear: GearIcon,
  dashboard: DashboardIcon,
  exit: ExitIcon,
  trash: TrashIcon,
  bookmark: BookmarkIcon,
  layout: LayoutIcon,
  package: BackpackIcon,
  layers: LayersIcon,
  cube: CubeIcon,
  heartFill: HeartFilledIcon,
  spinner: CircleIcon,
  upload: UploadIcon,
  folder: FolderIcon,
  tag: TagIcon,
  clock: ClockIcon,
  users: UsersIcon,
  refresh: RefreshCwIcon,
  shoppingBag: ShoppingBagIcon,
  shield: ShieldIcon,
  creditCard: CreditCardIcon,
  trendingUp: TrendingUpIcon,
  checkCircle: CheckCircleIcon,
  dollarSign: DollarSignIcon,
  phone: PhoneIcon,
  mail: MailIcon,
  eye: EyeIcon,
  x: XIcon,
  logout: LogOutIcon,
  cart: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  ),
  user: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  ),
};
