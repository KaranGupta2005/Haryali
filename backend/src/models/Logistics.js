import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  vehicleNumber: { type: String, required: true },
  vehicleType: String,
  region: String,
  hasEquipment: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  totalEarnings: { type: Number, default: 0 },
  completedTrips: { type: Number, default: 0 },
  totalTonnage: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
});


const jobSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  farmerName: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], 
  },
  address: String,
  region: String,
  cropType: String,
  tonnes: Number,
  pickupTime: String,
  pickupDate: Date,
  distance: Number,
  price: Number,
  status: { type: String, enum: ['available', 'assigned', 'in-progress', 'completed', 'cancelled'], default: 'available' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  createdAt: { type: Date, default: Date.now },
});

jobSchema.index({ location: '2dsphere' });

const tripSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  jobs: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    farmerName: String,
    location: { coordinates: [Number] },
    tonnes: Number,
    distance: Number,
    pickupTime: Date,
    status: { type: String, enum: ['pending', 'picked-up', 'delivered'], default: 'pending' },
  }],
  buyerLocation: { coordinates: [Number] },
  totalDistance: Number,
  totalTonnage: Number,
  baseEarnings: Number,
  bonus: Number,
  totalEarnings: Number,
  fuelCost: Number,
  startTime: Date,
  endTime: Date,
  currentStep: { type: Number, default: 0 },
  status: { type: String, enum: ['planned', 'in-progress', 'completed', 'cancelled'], default: 'planned' },
  route: [[Number]], 
  createdAt: { type: Date, default: Date.now },
});
tripSchema.index({ driverId: 1, status: 1 });

const paymentSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['UPI', 'Bank Transfer', 'Cash'], default: 'UPI' },
  upiId: String,
  transactionId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  processedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalParaliListed: Number,
  totalParaliSold: Number,
  totalParaliTransported: Number,
  co2Saved: Number, // in tonnes
  totalRevenue: Number,
  activeDrivers: Number,
  activeFarmers: Number,
  activeBuyers: Number,
  completedTrips: Number,
});


