import mongoose from 'mongoose';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const connectToDB=async () => {
  await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/test');
}

connectToDB()
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
});

export default connectToDB;