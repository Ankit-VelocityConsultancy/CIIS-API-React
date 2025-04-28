import { atom, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

// Atoms for storing state
export const companyAtom = atom({
  key: "companyAtom",
  default: "CIIS"
});

export const baseURLAtom = atom({
  key: "baseURLAtom",
  default: "dev.onlineexaminationportal.com/"
});

// Use simple string value for tokens, no need to parse them
export const accessTokenAtom = atom({
  key: "accessTokenAtom",
  default: localStorage.getItem('access') || null // Tokens are stored as strings
});

export const refreshTokenAtom = atom({
  key: "refreshTokenAtom",
  default: localStorage.getItem('refresh') || null // Tokens are stored as strings
});

// These are simple strings, so we do not need to parse them
export const usernameAtom = atom({
  key: "usernameAtom",
  default: localStorage.getItem('username') || null
});

export const useremailAtom = atom({
  key: "useremailAtom",
  default: localStorage.getItem('useremail') || null
});

export const userTypeAtom = atom({
  key: "userTypeAtom",
  default: localStorage.getItem('user_type') || null
});

export const userIdAtom = atom({
  key: "userIdAtom",
  default: localStorage.getItem('user_id') || null
});

export const isLoggedinAtom = atom({
  key: 'isLoggedinAtom',
  default: localStorage.getItem('is_login') === "true" // Directly check the string value
});

export const userVersion = atom({
  key: 'userVersion',
  default: localStorage.getItem('version') || null
});

// Custom Hook for logging out
export const useLogOut = () => {
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUseremail = useSetRecoilState(useremailAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setLoggedin = useSetRecoilState(isLoggedinAtom);
  const setUserVersion = useSetRecoilState(userVersion);
  
  const navigate = useNavigate();

  const logOut = () => {
    // Clear Recoil state
    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setUserId(null);
    setUserType(null);
    setLoggedin(false);
    setUseremail(null);
    setUserVersion(null);

    // Clear localStorage
    localStorage.clear();

    // Navigate to the login page
    navigate("/login");
  };

  return logOut;
};
