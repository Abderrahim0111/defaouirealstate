import { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSucces } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/end";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [userData, setuserData] = useState({});
  const [userListings, setuserListings] = useState([]);
  const [file, setfile] = useState();
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = async (eo) => {
    const confirm1 = window.confirm("Update profile?")
    if(!confirm1) return
    eo.preventDefault();
    setloading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userData", JSON.stringify(userData));
    try {
      const res = await fetch(`${api}/update-profile`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        setloading(false);
        return;
      }
      dispatch(loginSucces(data));
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  const handleDeleteUser = async () => {
    const confirm2 = window.confirm("Delete account?")
    if(!confirm2) return
    try {
      const res = await fetch(`${api}/delete-user`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();
      if (data.error) {
        return seterror(data.error);
      }
      seterror("");
      dispatch(loginSucces(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch(`${api}/sign-out`, {credentials: 'include',});
      const data = await res.json();
      if (data.error) {
        return seterror(data.error);
      }
      seterror("");
      dispatch(loginSucces(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (eo) => {
    setuserData({ ...userData, [eo.target.name]: eo.target.value });
  };
  const handleShowListings = async () => {
    try {
      const res = await fetch(`${api}/listings`, {credentials: 'include',});
      const data = await res.json();
      if (!data.error) {
        seterror("");
        setuserListings(data);
      }
    } catch (error) {
      seterror(error.message);
    }
  };
  const handleDeleteListing = async (listingId) => {
    const confirm = window.confirm("Delete this listing?")
    if(!confirm) return
    try {
      const res = await fetch(`${api}/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data) {
        const newUserListings = userListings.filter((listing) => {
          return listing._id !== listingId;
        });
        setuserListings(newUserListings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (currentUser) {
    return (
      <form onSubmit={handleSubmit} className=" max-w-lg mx-auto mt-8">
        <h1 className=" text-center text-2xl font-semibold mb-4">Profile</h1>
        <div className=" flex justify-center">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(eo) => {
              setfile(eo.target.files[0]);
            }}
          />
          <img
            className=" h-28 w-28 rounded-full mb-4 hover:cursor-pointer hover:opacity-95"
            src={file ? file.name : currentUser.avatar}
            alt="profile"
            onClick={() => {
              fileRef.current.click();
            }}
          />
        </div>
        <div className=" flex flex-col gap-4 mb-5">
          <input
            defaultValue={currentUser.username}
            className=" p-3 rounded-lg"
            type="text"
            name="username"
            placeholder="username"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            className=" p-3 rounded-lg"
            type="email"
            name="email"
            placeholder="email"
            onChange={handleChange}
          />
          <input
            className=" p-3 rounded-lg"
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
          />
          <button className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            {loading ? "loading..." : "update"}
          </button>
          <Link
            className=" bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95 uppercase"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </div>
        <div className=" flex justify-between text-red-600">
          <button onClick={handleDeleteUser}>Delete account</button>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
        {error ? <p>{error}</p> : null}
        <button
          type="button"
          className=" text-green-700 w-full"
          onClick={handleShowListings}
        >
          Show listings
        </button>
        {userListings && userListings.length > 0 && (
          <div className=" flex flex-col gap-4 mb-5">
            <h1 className=" text-center mt-7 text-2xl font-semibold">
              Your listings
            </h1>
            {userListings.map((listing) => {
              return (
                <div
                  className=" border rounded-lg p-3 flex justify-between items-center gap-4"
                  key={listing._id}
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      className=" h-16 w-16 object-contain"
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                    />
                  </Link>
                  <Link
                    className="flex-1 text-slate-700 font-semibold hover:underline truncate"
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>
                  <div className=" flex flex-col items-center">
                    <button
                      onClick={() => {
                        handleDeleteListing(listing._id);
                      }}
                      type="button"
                      className=" text-red-700 uppercase"
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button
                        type="button"
                        className=" text-green-700 uppercase"
                      >
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </form>
    );
  }
};

export default Profile;
