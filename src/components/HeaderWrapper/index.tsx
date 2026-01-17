import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from './styles.module.scss'; // Import your SCSS

export default function HeaderWrapper() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Ensure the page scrolls to top on mount
    window.scrollTo(0, 0);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile breakpoint
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setHeaderVisible(window.scrollY > 10); // Show header after scrolling 100px
    };

    handleResize(); // Initial load
    handleScroll(); // Initial scroll check

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const generateBreadcrumb = () => {
    const pathArray = router.asPath.split("/").filter((path) => path);

    return (
      <div className={styles.breadcrumb}>

        {pathArray.map((path, index) => (
          <div key={index} className={styles.breadcrumbItem}>
            <span>{'>'}</span>
            <span className={styles.capitalize}>{path}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={`${styles.appBar} ${headerVisible ? styles.headerVisible : styles.headerHidden}`} // Apply animation classes
      >
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" className={styles.logo} onClick={() => router.push('/')}>

            {/* Replace the src with your actual logo URL */}
            <img src="./images/logo/apts_logo.png" alt="aptcarePetWeb  Logo" />

          </Typography>

          {!isMobile ? (
            <div className={styles.desktopMenu}>
              <Button color="inherit" href="/">Home</Button>
              <Button color="inherit" href="/about">About</Button>
              <Button color="inherit" href="/services">Services</Button>
              <Button color="inherit" href="/contact">Contact</Button>
            </div>
          ) : (
            <>
              {/* <div className={styles.breadcrumbWrapper}>
                {generateBreadcrumb()}
              </div> */}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setMenuOpen(!menuOpen)}
                className={styles.menuButton}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {menuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <ul className={styles.mobileMenuList}>
            <li className={styles.mobileMenuItem}>
              <a href="/">Home</a>
            </li>
            <li className={styles.mobileMenuItem}>
              <a href="/about">About</a>
            </li>
            <li className={styles.mobileMenuItem}>
              <a href="/services">Services</a>
            </li>
            <li className={styles.mobileMenuItem}>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
