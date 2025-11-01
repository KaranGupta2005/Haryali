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

export const getMarketplaceListings = async (req, res) => {
  const listings = await Parali.find({
    isListedForMarketplace: true,
    status: { $ne: "Sold" },
  }).sort({ createdAt: -1 });

  res.status(200).json({ count: listings.length, listings });
};

export const listForMarketplace = async (req, res) => {
  const { id } = req.params;
  const listing = await Parali.findByIdAndUpdate(
    id,
    { isListedForMarketplace: true, status: "Listed" },
    { new: true }
  );

  if (!listing)
    return res.status(404).json({ message: "Listing not found" });

  res.status(200).json({
    message: "✅ Listing successfully added to marketplace",
    listing,
  });
};
