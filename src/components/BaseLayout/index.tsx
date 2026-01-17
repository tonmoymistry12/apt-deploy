import React from "react";
import Head from "next/head";
import HeaderWrapper from "../HeaderWrapper";
import Footer from "../Footer";

interface Props {
  children: React.ReactElement;
}

export default function BaseLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>aptcarePetWeb </title>
        </Head>
      
      {children}
     
    </>
  );
}
