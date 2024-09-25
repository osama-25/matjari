"use client";
import { redirect, useRouter } from 'next/navigation'; // Adjust import based on your Next.js version
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export default function Welcome() {
  redirect('/home');
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login'); // Redirect to the login page
  };

  const handleRegisterClick = () => {
    router.push('/register'); // Redirect to the register page
  };

  {/*return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Button onClick={handleLoginClick} className="mb-3">
          Login
        </Button>
        <br />
        <Button onClick={handleRegisterClick}>
          Register
        </Button>
      </div>
    </div>
  );*/}
}
