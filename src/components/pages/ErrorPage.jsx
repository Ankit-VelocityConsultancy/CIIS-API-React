import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import error_image from "../../assets/Images/error-image.png";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useSetRecoilState } from "recoil";
import {
  accessTokenAtom,
  isLoggedinAtom,
  refreshTokenAtom,
  userIdAtom,
  userTypeAtom,
  usernameAtom,
} from "@/recoil/atoms";

export const ErrorPage = ({ error, resetErrorBoundary }) => {
  console.log("Error occurred", error);
  console.log("Error type:", typeof error);
  console.log("Error keys:", Object.keys(error));
  console.log("Error values:", Object.values(error));

  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setLoggedin = useSetRecoilState(isLoggedinAtom);

  const logoutUser = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setUserId(null);
    setUserType(null);
    setLoggedin(false);
    localStorage.clear();
  };

  const handleLogoutClick = () => {
    logoutUser();
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };

  return (
    <div className="error-image h-svh flex flex-col justify-center items-center gap-5">
      <img src={error_image} alt="Error Image" />
      <div className="error-details">
        <div className="flex flex-col gap-2">
          <Alert variant="destructive" className="flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle className="!mb-0 text-base">
              Something went wrong, Try refresh or log out and login again.
            </AlertTitle>
          </Alert>
          <div className="err-message-wrapper flex justify-center">
            <strong>Error Message:</strong>
            <pre>{error.message || 'No error message available'}</pre>
          </div>
        </div>
        {Object.entries(error).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {String(value)}
          </div>
        ))}
      </div>
      <Button onClick={handleLogoutClick} variant="destructive">
        Logout
      </Button>
    </div>
  );
};
