import React from "react";
import Hero from "../../components/Hero/Hero";
import FeaturedArticles from "../../components/FeaturedArticles/FeaturedArticles";
import classNames from "classnames";
import Sidebar from "../../components/SideBar/SideBar";
import Styles from "./HomeScreen.module.css";
import Button from "../../components/Atoms/Button/Button";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {!userInfo && <Hero />}
      <div className="">
        <div>
          <FeaturedArticles />
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default HomeScreen;
