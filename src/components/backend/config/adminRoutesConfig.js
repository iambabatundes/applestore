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
// import OrderAnalytics from "../orders/OrderAnalytics";
// import OrderSettings from "../orders/OrderSettings";
// import Inventory from "../orders/Inventory";
import AllPages from "../allPages";
import NewPage from "../newPage";
import Promotions from "../promotions/promotions";
import Coupon from "../coupon";
import AllUsers from "../allUsers";
import Profile from "../profile";
import GeneralSettings from "../generalSettings";
import AppearanceSettings from "../appearanceSettings";
import AdminInvite from "../AdminInvite";
// import PaymentAdminDashboard from "../payments";

import { Icons } from "../common/modernIcons";
import OrderAnalytics from "../orders/orderAnalytics";
import OrderStatsDashboard from "../orders/orderStatsDashboard";
import CouponStatsPage from "../coupons/couponStatsPage";
import TaxStatistics from "../taxRate/taxStatistics";
import TaxConfiguration from "../taxRate/TaxConfiguration";
import PaymentAdminDashboard from "../payments/paymentAdminDashboard";
import AllPayments from "../payments/allPayments";
import PaymentConfiguration from "../payments/paymentConfiguration";
import PaymentStats from "../payments/paymentStats";
import SubscriptionManagement from "../payments/subscriptionManagement";
import SubscriptionPlansManagement from "../payments/subscriptionPlansManagement";
import ReportsGeneration from "../payments/reportsGeneration";
// import DisputeManagement from "../payments/DisputeManagement";
import FraudDetectionDashboard from "../payments/fraudDetectionDashboard";
import WebhookLogsViewer from "../payments/webhookLogsViewer";

export const sidebarLinks = (darkMode, adminUser) => {
  const baseLinks = [
    {
      label: "Dashboard",
      to: "/admin/home",
      content: <Dashboard darkMode={darkMode} />,
      icon: Icons.Dashboard,
      dropdown: [
        {
          label: "Home",
          to: "/admin/home",
          content: <Dashboard darkMode={darkMode} />,
        },
        {
          label: "Updates",
          to: "/admin/updates",
          content: <Updates />,
        },
        {
          label: "SEO",
          to: "/admin/seo",
          content: <SEO />,
        },
        {
          label: "Shipping Rate",
          to: "/admin/shipping",
          content: <ShippingRate />,
        },
      ],
    },
    {
      label: "Posts",
      to: "/admin/posts",
      icon: Icons.Posts,
      content: <AllPosts darkMode={darkMode} />,
      dropdown: [
        {
          label: "All Posts",
          to: "/admin/posts",
          content: <AllPosts darkMode={darkMode} />,
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
      content: <AllProduct darkMode={darkMode} />,
      icon: Icons.Products,
      dropdown: [
        {
          label: "All Products",
          to: "/admin/all-products",
          content: <AllProduct darkMode={darkMode} />,
        },
        {
          label: "Add Product",
          to: "/admin/add-product",
          content: <AddProduct darkMode={darkMode} user={adminUser} />,
        },
        {
          label: "Product Inventoy",
          to: "/admin/inventory",
          // content: <Inventory darkMode={darkMode} />,
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
      icon: Icons.Media,
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
      label: "Payments",
      to: "/admin/payments",
      content: <PaymentAdminDashboard />,
      icon: Icons.Payments,
      dropdown: [
        {
          label: "Dashboard",
          to: "/admin/payments",
          content: <PaymentAdminDashboard />,
        },
        {
          label: "All Payments",
          to: "/admin/all-payments",
          content: <AllPayments />,
        },

        {
          label: "Subscriptions",
          to: "/admin/subscriptions",
          content: <SubscriptionManagement />,
        },
        {
          label: "Subscriptions Plan",
          to: "/admin/create-subscriptions",
          content: <SubscriptionPlansManagement />,
        },

        {
          label: "Payment Configuration",
          to: "/admin/payments-configuration",
          content: <PaymentConfiguration />,
        },
        {
          label: "Payment Report",
          to: "/admin/payments-report",
          content: <ReportsGeneration />,
        },
        {
          label: "Payment Fraud",
          to: "/admin/payments-fraud",
          content: <FraudDetectionDashboard />,
        },
        {
          label: "Webhook Logs",
          to: "/admin/payments-webhook",
          content: <WebhookLogsViewer />,
        },
      ],
    },
    {
      label: "Orders",
      to: "/admin/orders",
      icon: Icons.Orders,
      content: <Orders darkMode={darkMode} />,
      dropdown: [
        {
          label: "All Orders",
          to: "/admin/orders",
          content: <Orders darkMode={darkMode} />,
        },
        {
          label: "Analytics",
          to: "/admin/orders/analytics",
          content: <OrderAnalytics darkMode={darkMode} />,
        },
        {
          label: "Order Stats",
          to: "/admin/orders/stats",
          content: <OrderStatsDashboard darkMode={darkMode} />,
        },
        {
          label: "Settings",
          to: "/admin/orders/settings",
          // content: <OrderSettings darkMode={darkMode} />,
        },
      ],
    },
    {
      label: "Promotion",
      to: "/admin/create-promotion",
      icon: Icons.Promotion,
      content: <Promotions />,
      dropdown: [],
    },
    {
      label: "Shipping",
      to: "/admin/shipping",
      icon: Icons.Shipping,
      content: <ShippingRate />,
      dropdown: [
        {
          label: "Shipping Rate",
          to: "/admin/shipping",
          content: <ShippingRate />,
        },
        {
          label: "Statistic Shipping",
          to: "/admin/statistics",
          // content: <Statistic />,
        },
        {
          label: "Stats Shipping",
          to: "/admin/stats",
          // content: <Stats />,
        },
      ],
    },
    {
      label: "Coupons",
      to: "/admin/coupons",
      icon: Icons.Coupon,
      content: <Coupon darkMode={darkMode} />,
      dropdown: [
        {
          label: "Coupon Stats",
          to: "/admin/coupon/coupon-stats",
          content: <CouponStatsPage darkMode={darkMode} />,
        },
      ],
    },
    {
      label: "Taxs",
      to: "/admin/tax-rate",
      icon: Icons.Pages,
      content: <TaxRate />,
      dropdown: [
        {
          label: "Tax Rate",
          to: "/admin/tax-rate",
          content: <TaxRate />,
        },
        {
          label: "Tax Statistics",
          to: "/admin/tax-statistics",
          content: <TaxStatistics />,
        },
        {
          label: "Tax Configuration",
          to: "/admin/tax-config",
          content: <TaxConfiguration />,
        },
      ],
    },
    {
      label: "Pages",
      to: "/admin/all-pages",
      icon: Icons.Pages,
      content: <AllPages darkMode={darkMode} />,
      dropdown: [
        {
          label: "All Pages",
          to: "/admin/all-pages",
          content: <AllPages darkMode={darkMode} />,
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
      icon: Icons.Users,
      content: <AllUsers darkMode={darkMode} />,
      dropdown: [
        {
          label: "All Users",
          to: "/admin/all-users",
          content: <AllUsers darkMode={darkMode} />,
        },
        {
          label: "Add New User",
          to: "/admin/new-user",
          // content: <AddUser />, // Create this component
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
      icon: Icons.Settings,
      content: <GeneralSettings darkMode={darkMode} />,
      dropdown: [
        {
          label: "General",
          to: "/admin/general",
          content: <GeneralSettings darkMode={darkMode} />,
        },
        {
          label: "Appearance",
          to: "/admin/appearance",
          content: <AppearanceSettings darkMode={darkMode} />,
        },
      ],
    },
  ];

  // Add Admin Management for super_admin
  if (
    adminUser &&
    (adminUser.role === "super_admin" || adminUser.hasPermission?.("admins"))
  ) {
    baseLinks.push({
      to: "/admin/manage-admins",
      icon: Icons.AdminManagement,
      label: "Admin Management",
      content: <AdminInvite darkMode={darkMode} />,
      dropdown: [],
    });
  }

  return baseLinks;
};

// Export permission-based route visibility helper
export const canAccessRoute = (route, user) => {
  // Super admin can access everything
  if (user?.role === "super_admin") {
    return true;
  }

  // Define route permissions
  const routePermissions = {
    "/admin/orders": ["admin", "super_admin"],
    "/admin/orders/analytics": ["admin", "super_admin"],
    "/admin/orders/settings": ["super_admin"],
    "/admin/payments": ["admin", "super_admin"],
    "/admin/manage-admins": ["super_admin"],
    "/admin/shipping": ["admin", "super_admin"],
    "/admin/tax-rate": ["admin", "super_admin"],
  };

  const requiredRoles = routePermissions[route];

  if (!requiredRoles) {
    // No specific permission required
    return true;
  }

  return requiredRoles.includes(user?.role);
};

// Export route configuration for easier management
export const routeConfig = {
  orders: {
    base: "/admin/orders",
    analytics: "/admin/orders/analytics",
    inventory: "/admin/orders/inventory",
    settings: "/admin/orders/settings",
  },
  payments: {
    base: "/admin/payments",
    all: "/admin/all-payments",
    configuration: "/admin/payments-configuration",
    subscriptions: "/admin/subscriptions",
  },
  products: {
    base: "/admin/all-products",
    add: "/admin/add-product",
    categories: "/admin/add-categories",
    tags: "/admin/add-tags",
  },
  users: {
    base: "/admin/all-users",
    add: "/admin/new-user",
    profile: "/admin/profile",
  },
};
