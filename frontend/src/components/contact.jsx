/* eslint-disable react/prop-types */
import  { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/end";

const Contact = ({ listing }) => {
  const [landlord, setlandlord] = useState(null);
  const [message, setmessage] = useState('');
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`${api}/${listing.userRef}`, {credentials: 'include',});
        const data = await res.json();
        setlandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const onChange = (eo) => {
    setmessage(eo.target.value)
  }
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className=" font-semibold">{landlord.username}</span> for{" "}
            <span className=" font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea className=" w-full border p-3 rounded-lg" name="message"rows="2" value={message} onChange={onChange} placeholder="Enter your message here"></textarea>
          <Link className=" bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95" to={`mailto:${landlord.email}?subject=Regardind ${listing.name}&body=${message}`}>
            Send message
          </Link>         
        </div>
      )}
    </div>
  );
};

export default Contact;
