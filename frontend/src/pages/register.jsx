import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useSelector, useDispatch } from 'react-redux'
import { loginSucces } from "../redux/user/userSlice";
import { api } from "../utils/end";

const Register = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate()
  useEffect(() => {
    if(currentUser){
      navigate('/')
    }
  },[])
  const [userData, setuserData] = useState({});
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch()

  const handleChange = (eo) => {
    setuserData({ ...userData, [eo.target.name]: eo.target.value });
  };
  const handleSubmit = async (eo) => {
    eo.preventDefault();
    setloading(true);
    const res = await fetch(`${api}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    const data = await res.json();
    if (data.error) {
      seterror(data.error);
      setloading(false);
    }
    if (!data.error) {
      dispatch(loginSucces(data))
      setloading(false);
      navigate("/");
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl text-center font-semibold my-7">Register</h1>
      <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
        <input
          className=" border p-3 rounded-lg"
          type="text"
          name="username"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          className=" border p-3 rounded-lg"
          type="email"
          name="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          className=" border p-3 rounded-lg"
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95 disabled:cursor-not-allowed"
        >
          {loading ? "loading.." : "Register"}
        </button>
        <OAuth />
      </form>
      <div className=" flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/login">
          <span className=" text-blue-700">Login</span>
        </Link>
      </div>
      {error ? <h1 className=" text-red-500">{error}</h1> : null}
    </div>
  );
};

export default Register;
