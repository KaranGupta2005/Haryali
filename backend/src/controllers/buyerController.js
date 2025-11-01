import Buyer from "../models/Buyer.js";
import Parali from "../models/Parali.js";

export const placeOrder = async (req, res) => {
  try {
    const { buyerName, buyerEmail, listingId, cropType, quantity, price } = req.body;

    if (!buyerEmail || !listingId)
      return res.status(400).json({ message: "Buyer email and listing ID required" });

    const listing = await Parali.findById(listingId);
    if (!listing)
      return res.status(404).json({ message: "Listing not found" });

    if (!listing.isListedForMarketplace)
      return res.status(400).json({ message: "Listing not available for order" });

    const totalAmount = Number(quantity) * Number(price);

    const order = new Buyer({
      buyerName,
      buyerEmail,
      listingId,
      cropType,
      quantity,
      price,
      totalAmount,
      status: "Ordered",
    });

    await order.save();

    listing.status = "Sold";
    listing.isListedForMarketplace = false;
    await listing.save();

    res.status(201).json({
      message: "✅ Order placed successfully!",
      order,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) return res.status(200).json({ orders: [] });

    const orders = await Buyer.find({ buyerEmail: email })
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching buyer orders:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Ordered", "In Transit", "Delivered"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const updatedOrder = await Buyer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json({
      message: `✅ Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: err.message });
  }
};
