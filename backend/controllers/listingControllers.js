const Listing = require("../models/listingSchema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    res.json(listing);
  } catch (error) {
    res.json({ error: error });
  }
};

const upload_files = async (req, res) => {
  const uploadedUrls = [];
  for (const file of req.files) {
    const result = await cloudinary.uploader.upload(file.path);
    uploadedUrls.push(result.secure_url);
  }
  res.json({ uploadSucces: uploadedUrls });
};

const deleteListing = async (req, res) => {
  const listing = await Listing.deleteOne({ _id: req.params.id });
  if (listing) {
    res.json({ message: "Delete succes" });
  }
};

const updateListing = async (req, res) => {
  try {
    const { imageUrls, ...otherData } = req.body;
    const upadatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      otherData,
      {
        new: true,
      }
    );
    res.json(upadatedListing);
    console.log(upadatedListing);
  } catch (error) {
    res.json(error);
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing) {
      res.json(listing);
    }
  } catch (error) {
    res.json(error);
  }
};

const getListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking == "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      furnished,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.json(listings);
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  createListing,
  upload_files,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
