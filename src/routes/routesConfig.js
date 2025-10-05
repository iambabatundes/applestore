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
import Checkout from "../components/checkout";
import NotFound from "../components/home/notFound";

const routesConfig = (props) => [
  { path: "/", element: <Home {...props} /> },

  { path: "/product", element: <Product {...props} /> },
  { path: "/blog/:title", element: <SinglePost /> },
  { path: "/:name", element: <SingleProducts {...props} /> },
  { path: "/register", element: <Register user={props.user} /> },
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },
  {
    path: "users/*",
    element: (
      <RequireAuth>
        <UserProfile />
      </RequireAuth>
    ),
  },
  { path: "/checkout", element: <Checkout cartItems={props.cartItems} /> },
  { path: "/cart", element: <Cart {...props} /> },
  { path: "/not-found", element: <NotFound /> },
  { path: "*", element: <NotFound /> },
];

export default routesConfig;
