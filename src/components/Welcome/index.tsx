import React, { useState, useEffect } from "react";
import styles from './styles.module.scss'; // Import your custom SCSS
import NonFixedHeader from "../NonFixedHeader";
import SignIn from "@/pages/signin";
import ForgotPassword from "@/pages/forgot-password";

export default function Welcome() {

  return (
    <div className={styles.welcomeContainer}>
      {/* Non-fixed Header */}
      {/*<NonFixedHeader />*/}
      
      {/* Video Background */}
      <div className={styles.videoContainer}>
        
     <SignIn />
     

      </div>
      
     


    </div>
  );
}
