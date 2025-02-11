import { useEffect } from 'react';
import { useNavigate } from 'react-router'

const AuthenticationGuard = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(()=>{
    if (!localStorage.getItem("chatUser") && !JSON.parse(localStorage.getItem("chatUser"))?.roomId) {
      navigate("/login");
    } else if(!JSON.parse(localStorage.getItem("chatUser")).name || !JSON.parse(localStorage.getItem("chatUser")).roomId) {
      navigate("/login")
    }
  }, [])

  return children;

  
}

export default AuthenticationGuard