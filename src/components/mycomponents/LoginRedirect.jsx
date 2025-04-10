import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedinAtom } from '../../recoil/atoms';

const LoginRedirect = ({ element }) => {
  const isLoggedIn = useRecoilValue(isLoggedinAtom);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return element;
};

export default LoginRedirect;
