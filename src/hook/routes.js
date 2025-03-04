import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../components/Home";
import Product from "./components/Product";
import SinglePost from "./components/singlePost";
import SingleProducts from "./components/home/singleProduct";
import Register from "./components/home/register";
import Login from "./components/home/login";
import Logout from "./components/home/logout";
import UserProfile from "./components/home/userProfile";
import RequireAuth from "./components/home/common/requireAuth";
import Checkout from "./components/checkout";
import Cart from "./components/cart";
import NotFound from "./components/home/notFound";

const AppRoutes = ({
  user,
  addToCart,
  cartItems,
  selectedCurrency,
  conversionRate,
}) => (
  <Routes>
    <Route
      path="/"
      element={
        <Home
          addToCart={addToCart}
          cartItems={cartItems}
          user={user}
          selectedCurrency={selectedCurrency}
          conversionRate={conversionRate}
        />
      }
    />
    <Route
      path="/product"
      element={<Product addToCart={addToCart} cartItems={cartItems} />}
    />
    <Route path="/blog/:title" element={<SinglePost />} />
    <Route
      path="/:name"
      element={
        <SingleProducts
          conversionRate={conversionRate}
          selectedCurrency={selectedCurrency}
        />
      }
    />
    <Route path="/register" element={<Register user={user} />} />
    <Route path="/login" element={<Login user={user} />} />
    <Route path="/logout" element={<Logout />} />
    <Route
      path="users/*"
      element={
        <RequireAuth user={user}>
          <UserProfile
            user={user}
            setUser={setUser}
            handleProfileSubmit={handleProfileSubmit}
            addToCart={addToCart}
            cartItems={cartItems}
          />
        </RequireAuth>
      }
    />
    <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
    <Route
      path="/cart"
      element={
        <Cart
          cartItems={cartItems}
          selectedQuantities={selectedQuantities}
          setSelectedQuantities={setSelectedQuantities}
          quantityTenPlus={quantityTenPlus}
          setQuantityTenPlus={setQuantityTenPlus}
          handleSubmit={handleSubmit}
          setCartItems={setCartItems}
          handleDelete={handleDelete}
          isLoggedIn={user}
          selectedCurrency={selectedCurrency}
          conversionRate={conversionRate}
        />
      }
    />
    <Route path="/not-found" element={<NotFound />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
