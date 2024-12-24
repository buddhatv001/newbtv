
  
import express from 'express';     
const app = express();     
import cors from 'cors'; 
  import ejs from 'ejs';   
  import fetch from 'node-fetch';   
  import axios from 'axios';
  import got from 'got';  
  import dotenv from 'dotenv';
  import fs from 'fs';
  dotenv.config();   
 import mongodb from 'mongodb';
  import mongoose from 'mongoose';    
  mongoose.connect(process.env.MONGOOSE_CONNECTION).then(()=>{console.log('success')}).catch((err)=>{console.error(err)});          
       
  import cookieParser from 'cookie-parser'; 
  import url from 'url';
  import { fileURLToPath } from 'url';
  import { dirname, join } from 'path'; 
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
     
  import session from 'express-session';   

   import bcrypt from 'bcryptjs';
  const saltRounds = 12; 
 import jwt from 'jsonwebtoken'; 
import MemDb from './models/register.js'; 
import ContactDb from './models/contact.js';    
import VideoDb from './models/videos.js'; 
import ShortDb from './models/shorts.js';    
 
  app.use(cookieParser());  
  import globalTok from './middlewares/global.js'; 
  app.use(globalTok);
  import authenticate from './middlewares/authentication.js';
import checkTok from './middlewares/authb.js';
import checkbTok from './middlewares/authc.js';
import checkcTok from './middlewares/authd.js';
import checkdTok from './middlewares/authe.js';
import admTok from './middlewares/authadmin.js';
import multer from 'multer';
import nodemailer from 'nodemailer';  
import cookie from 'cookie';  
import userRoute from './routes/userroute.js';    
 
   app.set('view engine', 'ejs'); 
   app.use(express.urlencoded({extended:false}));
   app.use(express.json());      
   app.use(cors()); 

   app.use('/', userRoute);    


        
 //SCRAPE YOUTUBE VIDEOS START
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 
const CUSTOM_THUMBNAIL_URL = "https://buddha.tv/images/newbdbg.png"; // Custom thumbnail URL   
 

app.get('/videos/yogaandmovement', (req, res) => {
    res.render('./pages/yoga');
});

app.get('/videos/wealthcreation', (req, res) => {
    res.render('./pages/wealth');
});

app.get('/videos/meditationandmindfulness', (req, res) => {
    res.render('./pages/meditation');
});

app.get('/videos/healthyliving', (req, res) => {
    res.render('./pages/healthy');
});

app.get('/videos/breathwork', (req, res) => {
    res.render('./pages/breathwork');
});

app.get('/videos/scienceofmindandquantumhealing', (req, res) => {
    res.render('./pages/somaqh');
});

app.get('/videos/psychedelichealing', (req, res) => {
    res.render('./pages/psychedelic');
});

app.get('/videos/ancientwisdom', (req, res) => {
    res.render('./pages/ancient');
});

app.get('/videos/personaldevelopmentandselfmastery', (req, res) => {
    res.render('./pages/personaldev');
});

app.get('/videos/soulhealingandtransformation', (req, res) => {
    res.render('./pages/soulhealing');
});
 


const categories = [
    'Yoga and movement',
    'Wealth creation',
    'Meditation and mindfulness',
    'Healthy living',
    'Breathwork',
    'Science of mind and quantum healing',
    'Psychedelic healing',
    'Ancient wisdom',
    'Personal Development and self mastery',
    'Soul healing and transformation',
    'Inspirational stories and teachings',
    'Community and connection',
];    

const scrapeds = [];


const categoriesLong = [
    'Sadhguru',
    'OSHO',
    'Meditative mind',
    'Mahakatha',   
    'Dauchsy',
    'Eckhart Tolle',  
    'Tony Robbins',    
    'Abraham-Hicks publications',  
    'Breathe with sandy',
    'Soul healing and transformation',
    'Inspirational stories and teachings',
    'Community and connection',   
];
 
  

 
// Unified function to scrape short videos from youtube base on the channel names and categories

async function scrapeAllCategories() {


    const popularPeople = [
        'Sadhguru', 
        'Eckhart Tolle', 
        'Jay Shetty', 
        'Alan Watts', 
        'Deepak Chopra', 
        'Dr. Joe Dispenza', 
        'Wayne Dyer', 
        'Thich Nhat Hanh', 
        'Oprah Winfrey', 
        'Robin Sharma', 
        'Rupert Spira', 
        'Neville Goddard', 
        'Marianne Williamson', 
        'Esther Hicks', 
        'Brene Brown', 
        'Tony Robbins'
    ];
    
   
    for (const category of categories) {   
        const query = popularPeople
        .map(person => `${category} ${person}`) // Combine each person's name with the category
        .join(' OR '); // Join them with "OR" for broader search results
    
        try {
            console.log(`Scraping videos for category: ${category}`);
            const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    key: YOUTUBE_API_KEY,
                    part: 'snippet',
                    q: category, // Search for videos matching the category
                    type: 'video',
                    maxResults:5,  
                    order: 'viewCount', // Sort by view count to prioritize popular videos
                    videoDuration: 'short', // Only include videos less than 4 minutes long 
                }, 
            });          
            console.log('Scraped successfully');      
            const videos = response.data.items.map(item => ({ 
                youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,  
            }));      
            console.log(videos);    
            for (const video of videos) {   
                scrapeds.push({ 
                     youtubeUrl : video.youtubeUrl,
                });   
        } 
        } catch (scrapeError) {
            console.log('Scraping error:', scrapeError);
        }
    }
}    

 


// Endpoint to trigger the scraping process
app.get('/scrapeshort', async (req, res) => {
    try {
        await scrapeAllCategories();
        fs.writeFile('./scrapedShortVideos.json', JSON.stringify(scrapeds, null, 2), 'utf-8', (err) => {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('File has been saved!');
            }
          });
        res.json({ message: 'Scraping process complete' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'An error occurred during the process' });
    }
});  
  //SCRAPE YOUTUBE VIDEOS END         



  async function scrapeAllCategoriesLong() {
    for (const category of categoriesLong) {
        try {
            console.log(`Scraping videos for category: ${category}`);
            const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    key: YOUTUBE_API_KEY,
                    part: 'snippet',
                    q: category, // Search for videos matching the category
                    type: 'video',
                    maxResults: 25, // Fetch up to 25 results
                    order: 'date', // Sort by view count to prioritize popular videos
                    videoDuration: 'long', // Only include videos less than 4 minutes long
                    videoEmbeddable: true, // Ensure the video can be embedded (not restricted) 
                }, 
            });          
            console.log('Scraped successfully');      
            const videos = response.data.items.map(item => ({
                title: `Curated by BuddhaTV: ${item.snippet.title}`,
                description: item.snippet.description,
                youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`, 
                videoId : item.id.videoId,     
            }));          
            for (const video of videos) {   
      //   const createdVideo = await VideoDb.create({   
          //   videoId : video.videoId,  
           //  title : video.title,
          //   description : video.description,     
        // });       
        scrapeds.push({
            videoId : video.videoId,  
             title : video.title,
             description : video.description, 
             youtubeUrl : video.youtubeUrl,
        });   
        // Save to a file 
          //console.log(createdVideo);  
         // console.log('saved to database');    
        } 
        } catch (scrapeError) {
            console.log('Scraping error:', scrapeError);
        }
    }
}    
   

  // Endpoint to trigger the scraping process
app.get('/scrapelong', async (req, res) => {
    try {
        await scrapeAllCategoriesLong();  
        fs.writeFile('./scrapedVideos.json', JSON.stringify(scrapeds, null, 2), 'utf-8', (err) => {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('File has been saved!');
            }
          });
        res.json({ message: 'Scraping process complete' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'An error occurred during the process' });
    }
});       




app.get('/removespaces', async (req, res) => {
    try {
        const vids = await ShortDb.find(); // Retrieve all documents

        // Loop through each document and update the category field
        for (const vid of vids) {
            const updatedCategory = vid.category.toLowerCase().replace(/\s+/g, ''); // Convert to lowercase and remove spaces
            await ShortDb.findOneAndUpdate(
                { _id: vid._id }, // Locate the document by its unique ID
                { $set: { category: updatedCategory } } // Update the category field
            );
        }

        res.status(200).send("Spaces removed and categories converted to lowercase successfully!");
    } catch (error) {
        console.error("Error updating categories:", error);
        res.status(500).send("An error occurred while updating categories.");
    }
});
   


   app.use(express.static(join(__dirname + '/public')));      

   app.listen(3000, ()=>{ console.log('Listening on port 3000')});      

 
      