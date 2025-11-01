import Parali from "../models/Parali.js";

export const newListing = async (req, res) => {
  const newListing = new Parali(req.body);
  await newListing.save();
  res.status(201).json({
    message: "✅ Listing created successfully",
    listing: newListing,
  });
};

export const getAllListings = async (req, res) => {
  const listings = await Parali.find().sort({ createdAt: -1 });
  res.status(200).json({ count: listings.length, listings });
};

