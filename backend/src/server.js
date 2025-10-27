import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parserparser';
import dotenv from 'dotenv';

if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}
const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Haryali Backend Server is running');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


