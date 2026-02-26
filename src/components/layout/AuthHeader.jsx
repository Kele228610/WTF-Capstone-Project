import React from 'react';
import { Link } from 'react-router';
// import styles from './Header.module.css';
// import styles from './AuthHeader.module.css';

// const AuthHeader = () => {
//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <Link to="/" className={styles.logo}>
//           <div className={styles.logoIcon}>
//             <span className="material-icons">school</span>
//           </div>
//           <span className={styles.logoText}>EduLearn</span>
//         </Link>
//         <Link to="/signin" className={styles.signInBtn}>
//           Sign in
//         </Link>
//       </div>
//     </header>
//   );
// };

// export default AuthHeader;

// import './AuthHeader.module.css';


// const AuthHeader = () => {
//   	return (
//     		<div className="header">
//       			<div className="backgroundshadow">
//         				<div className="container">
//           					<div className="material-icons">school</div>
//                             <div className='text'>EduLearn</div>
//         				</div>
//       			</div>
//       			<b className="edulearn">EduLearn</b>
//     		</div>);
// };

// export default AuthHeader ;


// <header className={styles.header}>
//       <div className={styles.container}>
//         <Link to="/" className={styles.logo}>
        //   <div className={styles.logoIcon}>
        //     <span className="material-icons">school</span>
        //   </div>
        //   <span className={styles.logoText}>EduLearn</span>
        // </Link>


// import React from 'react';
// import { Link } from 'react-router';
// import styles from './Header.module.css';

// const AuthHeader = () => {
//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <Link to="/" className={styles.logo}>
//           <div className={styles.logoIcon}>
//             <span className="material-icons">school</span>
//           </div>
//           <span className={styles.logoText}>EduLearn</span>
//         </Link>
//         <Link to="/signin" className={styles.signInBtn}>
//           Sign in
//         </Link>
//       </div>
//     </header>
//   );
// };

// export default AuthHeader;

// import React from 'react';
// import { Link } from 'react-router';
// import styles from './Header.module.css';
// import logo from '../../assets/icon/edulearn.png'; // adjust filename/extension if different
// // import  Edulearn  from '../../assets/icon/edulearn logo.png'; // adjust filename/extension if different
// const AuthHeader = () => {
//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <Link to="/" className={styles.logo}>
//           <div className={styles.logoIcon}>
//             <img src={logo} alt="EduLearn" className={styles.logoImg} />
//           </div>
//           <span className={styles.logoText}>EduLearn</span>
//         </Link>
//         <Link to="/signin" className={styles.signInBtn}>
//           Sign in
//         </Link>
//       </div>
//     </header>
//   );
// };

// export default AuthHeader;
// ...existing code...


import styles from './AuthHeader.module.css';

const AuthHeader = () => {
  return (
    <div className={styles.header}>
      {/* Logo Icon */}
      <div className={styles.logoContainer}>
        <div className={styles.logoBackground}>
          <span className={styles.logoIcon}>school</span>
        </div>
      </div>

      {/* Brand Name */}
      <h2 className={styles.brandName}>EduLearn</h2>
    </div>
  );
};

export default AuthHeader;