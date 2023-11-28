import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatListing = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [imageUrls, setimageUrls] = useState([]);
  const [loading, setloading] = useState(false);
  const [uploadErrors, setuploadErrors] = useState("");
  const [submitErrors, setsubmitErrors] = useState("");
  const [files, setfiles] = useState([]);
  const [listingData, setListingData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  const handleImageSubmit = async () => {
    setloading(true);
    if (files.length == 0) {
      setuploadErrors("No image chosen");
      setloading(false);
    } else if (files.length > 0 && files.length < 7) {
      const formdata = new FormData();
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        formdata.append("files", file);
      }
      try {
        const res = await fetch("/api/listing/upload-files", {
          method: "POST",
          body: formdata,
        });
        const data = await res.json();
        if (data.uploadSucces) {
          setimageUrls(data.uploadSucces);
          setListingData({
            ...listingData,
            imageUrls: data.uploadSucces,
          });
        }
        setloading(false);
        setuploadErrors("");
      } catch (error) {
        setuploadErrors(error.message);
        setloading(false);
      }
    } else {
      setuploadErrors("You can only upload 6 images per listing");
      setloading(false);
    }
  };
  const handleRemoveImage = (index) => {
    const filteredImages = imageUrls.filter((item, i) => {
      return i != index;
    });
    setimageUrls(filteredImages);
    const filteredFiles = files.filter((item, i) => {
      return i != index;
    });
    setfiles(filteredFiles);
    console.log(files);
  };
  const handleChange = (eo) => {
    if (eo.target.name === "rent" || eo.target.name === "sale") {
      setListingData({
        ...listingData,
        type: eo.target.name,
      });
    }

    if (
      eo.target.name === "parking" ||
      eo.target.name === "furnished" ||
      eo.target.name === "offer"
    ) {
      setListingData({
        ...listingData,
        [eo.target.name]: eo.target.checked,
      });
    }

    if (
      eo.target.type === "number" ||
      eo.target.type === "text" ||
      eo.target.type === "textarea"
    ) {
      setListingData({
        ...listingData,
        [eo.target.name]: eo.target.value,
      });
    }
  };
  const handleSubmit = async (eo) => {
    eo.preventDefault();
    try {
      if(listingData.imageUrls.length < 1) return setsubmitErrors('You must upload at least one image')
      if(+listingData.regularPrice < +listingData.discountPrice) return setsubmitErrors('Discount price must be lower than the regular price')
      setloading(true)
      const updatedListingData = {
        ...listingData,
        imageUrls: imageUrls,
        userRef: currentUser._id,
      };
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedListingData),
      });
      const data = await res.json();
      if(!data.error){
        setloading(false)
        setsubmitErrors('')
        navigate(`/listing/${data._id}`)
      }else{
        setsubmitErrors(data.error)
        setloading(false)
      }
    } catch (error) {
      setsubmitErrors(error.message);
      setloading(false)
    }
  };
  return (
    <main className=" p-3 max-w-4xl mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col sm:flex-row gap-4"
      >
        <div className=" flex flex-col gap-4 flex-1">
          <input
            className=" border p-3 rounded-lg"
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            value={listingData.name}
          />
          <textarea
            className=" border p-3 rounded-lg"
            name="description"
            placeholder="description"
            required
            onChange={handleChange}
            value={listingData.description}
          />
          <input
            className=" border p-3 rounded-lg"
            type="text"
            name="address"
            placeholder="address"
            required
            onChange={handleChange}
            value={listingData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="felx gap-2 ">
              <input
                className=" w-5"
                type="checkbox"
                name="sale"
                onChange={handleChange}
                checked={listingData.type == "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="felx gap-2">
              <input
                className=" w-5"
                type="checkbox"
                name="rent"
                onChange={handleChange}
                checked={listingData.type == "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="felx gap-2">
              <input
                className=" w-5"
                type="checkbox"
                name="parking"
                onChange={handleChange}
                checked={listingData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="felx gap-2">
              <input
                className=" w-5"
                type="checkbox"
                name="furnished"
                onChange={handleChange}
                checked={listingData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="felx gap-2">
              <input
                className=" w-5"
                type="checkbox"
                name="offer"
                onChange={handleChange}
                checked={listingData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                type="number"
                name="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                defaultValue={listingData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                type="number"
                name="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                defaultValue={listingData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                type="number"
                name="regularPrice"
                min="0"
                max="1000000"
                required
                onChange={handleChange}
                defaultValue={listingData.regularPrice}
              />
              <div className="flex items-center flex-col ">
                <p>Regular price</p>
                <span className=" text-xs">($ / month)</span>
              </div>
            </div>
            { listingData.offer && <div className="flex items-center gap-2">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                type="number"
                name="discountPrice"
                min="0"
                max="1000000"
                required
                onChange={handleChange}
                defaultValue={listingData.discountPrice}
              />
              <div className="flex items-center flex-col">
                <p>Discounted price</p>
                <span className=" text-xs">($ / month)</span>
              </div>
            </div>}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className=" font-semibold">
            Images:
            <span className=" font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className=" p-3 border border-gray-300 rounded w-full"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={(eo) => {
                const fileList = eo.target.files;
                const fileArray = Array.from(fileList);
                setfiles([...files, ...fileArray]);
              }}
            />
            <button
              type="button"
              className=" p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg"
              onClick={handleImageSubmit}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {uploadErrors && (
            <p className=" text-sm text-red-500">{uploadErrors}</p>
          )}
          {imageUrls &&
            imageUrls.map((imgUrl, index) => {
              return (
                <div
                  key={imgUrl}
                  className=" flex justify-between p-3 border items-center"
                >
                  <img
                    className="w-20 h-20 object-contain rounded-lg"
                    src={imgUrl}
                    alt="img"
                  />
                  <button
                    type="button"
                    className=" text-red-700 rounded-lg uppercase hover:opacity-75"
                    onClick={() => {
                      handleRemoveImage(index);
                    }}
                  >
                    delete
                  </button>
                </div>
              );
            })}
          <button className=" p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
            Create Listing
          </button>
          {submitErrors && <p className=" text-red-600">{submitErrors}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreatListing;
