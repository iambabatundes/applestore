import Home from "../components/Home";
import Product from "../components/Product";
import SinglePost from "../components/singlePost";
import SingleProducts from "../components/home/singleProduct";
import Login from "../components/home/login";
import Register from "../components/home/register";
import Logout from "../components/home/logout";
import UserProfile from "../components/home/userProfile";
import RequireAuth from "../components/home/common/requireAuth";
import Cart from "../components/cart";
import Checkout from "../components/home/checkout/checkout";
import NotFound from "../components/home/notFound";

const routesConfig = (props) => [
  { path: "/", element: <Home {...props} /> },
  { path: "/product", element: <Product {...props} /> },
  { path: "/blog/:title", element: <SinglePost {...props} /> },
  { path: "/register", element: <Register {...props} /> },
  { path: "/login", element: <Login {...props} /> },
  { path: "/logout", element: <Logout {...props} /> },
  {
    path: "/users/*",
    element: (
      <RequireAuth>
        <UserProfile {...props} />
      </RequireAuth>
    ),
  },
  { path: "/cart", element: <Cart {...props} /> },
  { path: "/checkout", element: <Checkout {...props} /> },
  { path: "/not-found", element: <NotFound {...props} /> },
  // Dynamic route should come LAST to avoid conflicts
  { path: "/:name", element: <SingleProducts {...props} /> },
  { path: "*", element: <NotFound {...props} /> },
];

export default routesConfig;
