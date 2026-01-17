import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { MouseEvent } from 'react';

// Define the type for each breadcrumb link
interface BreadcrumbLink {
  label: string;
  href: string;
}

// Define the props for the Breadcrumb component
interface BreadcrumbProps {
  links: BreadcrumbLink[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ links }) => {
  const router = useRouter();

  // Handle click for the links to navigate programmatically
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    router.push(href);
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, index) => {
        if (index === links.length - 1) {
          return (
            <Typography color="text.primary" key={link.label}>
              {link.label}
            </Typography>
          );
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            underline="hover"
            color="inherit"
          >
            {link.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
