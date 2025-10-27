import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}
const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", 
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectToDB();

app.use('/api/auth',authRoutes);

app.get('/', (req, res) => {
    res.send('Haryali Backend Server is running');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


