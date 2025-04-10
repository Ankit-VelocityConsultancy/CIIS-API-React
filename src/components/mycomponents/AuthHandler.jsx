import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedinAtom } from "../../recoil/atoms";

const AuthHandler = () => {
  const [isLoggedin, setIsLoggedin] = useRecoilState(isLoggedinAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsLoggedin(true);
      navigate("/");
    }
  }, [isLoggedin]);

  return null;
};

export default AuthHandler;
