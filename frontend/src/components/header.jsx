import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setsearchTerm] = useState('');
  const navigate = useNavigate()
  const handleSubmit = (eo) => {
    eo.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if(searchTermFromUrl){
      setsearchTerm(searchTermFromUrl)
    }
  }, [location.search])
  return (
    <header className=" bg-slate-200 shadow-md">
      <div className=" container mx-auto flex justify-between items-center p-3">
        <Link to="/">
          <h1 className=" font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500 ">Defaoui</span>
            <span className=" text-slate-700">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className=" bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className=" bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            name=""
            placeholder="Search..."
            onChange={(eo) => {
              setsearchTerm(eo.target.value)
            }}
            value={searchTerm}
          />
          <button>
            <FaSearch className=" text-slate-600 " />
          </button>
        </form>
        <ul className=" flex gap-4">
          <Link to="/">
            <li className=" hidden sm:block text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className=" sm:block text-slate-700 hover:underline">About</li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                className=" rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            </Link>
          ) : (
            <Link to="/login">
              <li className=" sm:block text-slate-700 hover:underline">
                Login
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
