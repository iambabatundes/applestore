import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Contact from "./components/Contact";
import About from "./components/About";

// const Home = () => <h1>Home Page</h1>;

function App() {
  return (
    <>
      <NavBar />
      <main className="main">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/cart" component={<Cart />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
