import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <span className="material-icons">school</span>
          </div>
          <span className={styles.logoText}>EduLearn</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to="/login" className={styles.signInBtn}>Sign in</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={styles.menuBtn} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="material-icons">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/login" className={styles.signInBtn}>Sign in</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
