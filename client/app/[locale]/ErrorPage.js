import Link from "next/link";

const ErrorPage = ({ message, statusCode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-700">{statusCode || 404}</h1>
        <p className="text-xl text-gray-800 mt-4">{message || "Something went wrong."}</p>
        <p className="text-md text-gray-600 mt-2">
          You might want to go back to the homepage or contact support if the issue persists.
        </p>
        <Link href="/home" className="mt-6 inline-block px-6 py-3 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
