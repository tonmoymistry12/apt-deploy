import React, { FC, useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { Button, TextField } from '@mui/material';import styles from './styles.module.scss'; // Import your SCSS styles
import emailjs from 'emailjs-com'; // Import Email.js

const Footer: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    mobile: '', // Add mobile field
  });

 

  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
        

         
        </div>
      </footer>

      <div className={styles.socialBox}>
        <div className={styles.socialMedia}>
          <a href="https://www.facebook.com/profile.php?id=61565864046291" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className={styles.icon} />
          </a>
          <a href="https://www.instagram.com/aptcarePetWeb /" target="_blank" rel="noopener noreferrer">
            <FaInstagram className={styles.icon} />
          </a>
          <a href="https://www.linkedin.com/company/aptcarePetWeb " target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn className={styles.icon} />
          </a>
          <a href="https://wa.me/8768194014" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className={styles.icon} />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className={styles.icon} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
