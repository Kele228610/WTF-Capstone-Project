import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./VerifyAccountPage.module.css";

export default function VerifyAccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `https://wtf-capstone-project-bqrp.vercel.app/api/v1/auth/verify-email?token=${token}`
        );

        if (!res.ok) throw new Error();

        setStatus("success");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        
        {/* Top curved section */}
        <div className={styles.header}>
          <div className={styles.iconBox}>
            🎓
          </div>
          <h2>EduLearn</h2>
        </div>

        {/* Content */}
        <div className={styles.body}>
          {status === "loading" && (
            <>
              <p>Verifying...</p>
              <div className={styles.spinner}></div>
            </>
          )}

          {status === "success" && (
            <>
              <p>✅ Verified successfully</p>
              <p className={styles.sub}>Redirecting...</p>
            </>
          )}

          {status === "error" && (
            <>
              <p>❌ Verification failed</p>
              <p className={styles.sub}>Invalid or expired link</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}