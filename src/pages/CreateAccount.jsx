import AuthHeader from '../components/layout/AuthHeader';
import CreateAccountForm from '../components/createaccountform/CreateAccountForm';
import styles from './CreateAccount.module.css';


export default function CreateAccount() {
  const handleBack = () => {
    console.log('Go back');
    
    // Handle navigation back
  };

  return (
    <div className={styles.page}>
      <AuthHeader onBack={handleBack} />
      <main className={styles.main}>
        <CreateAccountForm />
      </main>
    </div>
  );
}