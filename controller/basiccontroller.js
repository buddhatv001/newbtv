
import express from 'express';
const app = express();  
 
import OrdDb from '../models/orders.js'; 
import ejs from 'ejs';    
import bcrypt from 'bcryptjs';    
import ShortDb from '../models/shorts.js'; 


export const getHome = (req,res)=>{
    res.render('./pages/index');
}  

export const getSub = (req,res)=>{
   // res.render('./pages/subscribe'); 
   res.redirect('https://buddha.tv/subscribe');
}      

export const getAbt = (req,res)=>{
  res.redirect('https://buddha.tv/subscribe');
}    

export const getSuccess = async (req,res)=>{   
    const trxref = req.params.trxRef;  
    const unid = req.params.uniqueid; 
    const name = req.params.username; 
    const email = req.params.email;
    const orderDetails = await OrdDb.findOne({uniqueId : unid }); 
    if(!orderDetails){ 
        console.log('not exist');
          res.render('./pages/error');
    }     
    const itsMatch = await bcrypt.compare(trxref, orderDetails.trxRef); 
     if (itsMatch) { 
    res.render('./pages/success');   
    // Create a SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com', 
    port: 587,
    auth: {
      user:process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASS,
  }
});

// Define email options
 const emailAddresses = [  
   'healing@buddha.tv',
   'innerguru@buddha.tv',
   'monk@buddha.tv',  
   'victoremmy1876@gmail.com',
]; 
  
  
if(orderDetails.price === 8.88) {
  const mailOptions = {
    from: 'victoremmy1876@gmail.com',
    to: emailAddresses.join(', '),
    subject: 'Buddha Order information',
    html: `A new user has just subscribed to BuddhaTV with an $8.88 plan. The user's name is <b>${name}</b>, and their email is <b>${email}</b>.`,
  }; 
} else {
  const mailOptions = {
    from: 'victoremmy1876@gmail.com',
    to: emailAddresses.join(', '),
    subject: 'Buddha Order information',
    html: `A new user has just subscribed to BuddhaTV with an $88.88 plan. The user's name is <b>${name}</b>, and their email is <b>${email}</b>.`,
  }; 
} 



// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error occurred:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
      
    await OrdDb.findByIdAndDelete(orderDetails._id);  

  } else {
    res.render('./pages/error');
  }
}    


export const getCancel = async (req,res)=>{  
    res.render('./pages/cancel');
}   

export const getWatch = async (req,res)=>{    
  const category = req.params.category;
  const videos = await ShortDb.find({category : category});
  console.log(videos);
    res.render('./pages/videos', {videos});
}
 
 

  
export default { getHome, getSub, getSuccess, getCancel, getWatch,  getAbt, }     