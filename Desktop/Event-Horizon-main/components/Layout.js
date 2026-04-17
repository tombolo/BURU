import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <>
    <Header />
    <main className="min-h-screen pt-20 pb-12 bg-gray-50">{children}</main>
    <Footer />
  </>
);

export default Layout;
