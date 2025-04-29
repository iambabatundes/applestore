import Dashboard from "../dashboard";
import Updates from "../updates";
import SEO from "../seo";
import ShippingRate from "../shippingRate/shippingRate";
import TaxRate from "../taxRate/taxRate";
import AllPosts from "../allPosts";
import CreatePost from "../createPost";
import AddPostCategories from "../allPosts/addPostCategories";
import AddPostTags from "../allPosts/addPostTags";
import AllProduct from "../allProducts";
import AddProduct from "../addProduct";
import AddCategories from "../categories/addCategory";
import AddTags from "../tags/addTags";
import Upload from "../upload";
import NewMedia from "../newMedia";
import Orders from "../orders";
import AllPages from "../allPages";
import NewPage from "../newPage";
import Promotion from "../promotion";
import Promotions from "../promotions/promotions";
import Coupon from "../coupon";
import AllUsers from "../allUsers";
import Profile from "../profile";
import GeneralSettings from "../generalSettings";
import AppearanceSettings from "../appearanceSettings";

export const sidebarLinks = (darkMode, adminUser) => [
  {
    label: "Dashboard",
    to: "/admin/home",
    content: <Dashboard darkMode={darkMode} />,
    icon: "fa-tachometer",
    dropdown: [
      { label: "Home", to: "/admin/home", content: <Dashboard /> },
      { label: "Updates", to: "/admin/updates", content: <Updates /> },
      { label: "SEO", to: "/admin/seo", content: <SEO /> },
      {
        label: "Shipping Rate",
        to: "/admin/shipping",
        content: <ShippingRate />,
      },
      {
        label: "Tax Rate",
        to: "/admin/tax-rate",
        content: <TaxRate />,
      },
    ],
  },
  {
    label: "Posts",
    to: "/admin/posts",
    icon: "fa-pencil-square-o",
    content: <AllPosts darkMode={darkMode} />,
    dropdown: [
      {
        label: "All Posts",
        to: "/admin/posts",
        content: <AllPosts />,
      },
      {
        label: "Create Post",
        to: "/admin/create",
        content: <CreatePost adminUser={adminUser} />,
      },
      {
        label: "Categories",
        to: "/admin/posts-categories",
        content: <AddPostCategories />,
      },
      {
        label: "Tags",
        to: "/admin/posts-tags",
        content: <AddPostTags />,
      },
    ],
  },
  {
    label: "Products",
    to: "/admin/all-products",
    content: <AllProduct />,
    icon: "fa-tag",
    dropdown: [
      {
        label: "All Products",
        to: "/admin/all-products",
        content: <AllProduct />,
      },
      {
        label: "Add Product",
        to: "/admin/add-product",
        content: <AddProduct darkMode={darkMode} user={adminUser} />,
      },
      {
        label: "Categories",
        to: "/admin/add-categories",
        content: <AddCategories />,
      },
      {
        label: "Tags",
        to: "/admin/add-tags",
        content: <AddTags />,
      },
    ],
  },
  {
    label: "Media",
    to: "/admin/upload",
    content: <Upload />,
    icon: "fa-tag",
    dropdown: [
      {
        label: "Library",
        to: "/admin/upload",
        content: <Upload />,
      },
      {
        label: "Add New",
        to: "/admin/new-media",
        content: <NewMedia />,
      },
    ],
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: "fa-file",
    content: <Orders />,
    dropdown: [
      {
        label: "All Order",
        to: "/admin/orders",
        content: <Orders />,
      },
      {
        label: "All Pages",
        to: "/admin/all-pages",
        content: <AllPages />,
      },
    ],
  },
  {
    label: "Promotion",
    to: "/admin/promotions",
    icon: "fa-file",
    content: <Promotion />,
    dropdown: [
      {
        label: "Create",
        to: "/admin/create-promotions",
        content: <Promotions />,
      },
    ],
  },
  {
    label: "Coupon",
    to: "/admin/coupons",
    icon: "fa-file",
    content: <Coupon />,
    dropdown: [
      {
        label: "Create",
        to: "/admin/create-promotions",
        content: <Promotions />,
      },
    ],
  },
  {
    label: "Pages",
    to: "/admin/all-pages",
    icon: "fa-file",
    content: <AllPages />,
    dropdown: [
      {
        label: "All Pages",
        to: "/admin/all-pages",
        content: <AllPages />,
      },
      {
        label: "Add New",
        to: "/admin/new-page",
        content: <NewPage />,
      },
    ],
  },
  {
    label: "Users",
    to: "/admin/all-users",
    icon: "fa-users",
    content: <AllUsers />,
    dropdown: [
      {
        label: "All Users",
        to: "/admin/all-users",
        content: <AllUsers />,
      },
      {
        label: "Add New",
        to: "/admin/new-user",
        content: <NewPage />,
      },
      {
        label: "Profile",
        to: "/admin/profile",
        content: <Profile />,
      },
    ],
  },
  {
    label: "Settings",
    to: "/admin/general",
    icon: "fa-cog",
    content: <GeneralSettings />,
    dropdown: [
      {
        label: "General Settings",
        to: "/admin/general",
        content: <GeneralSettings />,
      },
      {
        label: "Appearance",
        to: "/admin/appearance",
        content: <AppearanceSettings />,
      },
    ],
  },
];
