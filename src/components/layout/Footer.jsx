import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'Mission', href: '#' },
      { label: 'About Us', href: '#' },
      { label: 'Impact', href: '#' },
      { label: 'Careers', href: '#' }
    ],
    resources: [
      { label: 'Help Center', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Use', href: '#' },
      { label: 'Sitemap', href: '#' }
    ]
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={styles.heading}>EduLearn</h3>
          <ul className={styles.list}>
            {footerLinks.company.map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.column}>
          <h3 className={styles.heading}>Resources</h3>
          <ul className={styles.list}>
            {footerLinks.resources.map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
