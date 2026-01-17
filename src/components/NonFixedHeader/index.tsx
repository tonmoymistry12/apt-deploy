import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss'; // Import SCSS file for styling
import { useGlobalStore } from "@/common/store";
import { useRouter } from 'next/router';
const NonFixedHeader: React.FC = () => {

    const { setFlow } = useGlobalStore();

    const router = useRouter();

    return (
        <div className={styles.header}>
            <div className={styles.logo} onClick={() => router.push('/')}>
                <img src="./images/logo/apts_logo.png" alt="aptcarePetWeb  Logo" />
            </div>
            <div className={styles.rightBox}>



            </div>

        </div>
    );
};

export default NonFixedHeader;
