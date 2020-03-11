import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Admin from "./pages/Admin.js";
import Login from "./pages/Login.js";
import Products from "./pages/Products.js";

const Pages = {
  "/products": {
    component: Products,
    text: "products"
  },
  "/about": {
    component: About,
    text: "about"
  },
  "/login": {
    component: Login,
    text: "login"
  },
  "/admin": {
    component: Admin,
    text: "admin",
    admin: true
  },
  "/": {
    component: Home,
    text: "home",
    hidden: true
  }
};

export default Pages;
