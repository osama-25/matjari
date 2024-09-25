"use client";
import NavBar from "./NavBar";
import Categories from "./Categories";
import ItemsDisplay from "./ItemsDisplay";
import AdDisplay from "./AdDisplay";

import { Button } from "react-bootstrap";
import axios from "axios";
import checkLogin from "../login/checklogin";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {

  // const router = useRouter();

  //   useEffect(() => {
  //       const checkAuthStatus = async () => {
  //           await checkLogin('/auth/home', router);
  //       };

  //       checkAuthStatus();
  //   }, [router]);

  return (
    <>
      <NavBar />
      <AdDisplay imageUrl={'https://opensooqui2.os-cdn.com/prod/public/images/homePage/spotlight/desktop/en/11-v2.webp'} altText={'AD'} />
      <Categories />
      <ItemsDisplay />

      {/* <Button onClick={handleClick}> Testing Something </Button> */}
    </>
  );
}
