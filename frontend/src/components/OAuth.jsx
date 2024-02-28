import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { loginSucces } from "../redux/user/userSlice";
import { api } from "../utils/end";

const OAuth = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch(`${api}/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        credentials: 'include',
      });
      const data = await res.json()
      if(!data.error){
        dispatch(loginSucces(data))
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className=" uppercase bg-red-700 text-white p-3 rounded-lg hover:opacity-95"
    >
      continue with google
    </button>
  );
};

export default OAuth;
