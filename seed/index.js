const mongoose=require('mongoose')
const Campground=require('../models/campground');
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')
const maptilerClient=require('@maptiler/client')
maptilerClient.config.apiKey=process.env.MAPTILER_API_KEY

mongoose.connect('mongodb://localhost:27017/yelp-camp',);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=Array=>Array[Math.floor(Math.random()*Array.length)]
seedDB=async ()=>{
  await  Campground.deleteMany({})
  for(let i=0;i<=300;i++){
    const random=Math.floor(Math.random()*1000)
    const randomPrice=Math.floor(Math.random()*20 +10)
    // const getData=await maptilerClient.geocoding.forward(cities[random].city,{limit:1})

    const camp=new Campground(
        {
            geometry:{
            type:"Point",
            coordinates:[cities[random].longitude,cities[random].latitude]
              },
          author:'67d151480fa0143c1255a03e',
          location:cities[random].city,location:cities[random].state,
         name:`${sample(descriptors)}, ${sample(places)}`,
         description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati dolore dolorum, saepe omnis ratione neque error animi praesentium itaque quasi! Distinctio doloremque blanditiis voluptatem suscipit mollitia? Modi fugit corporis enim.',
         price:randomPrice,
        images: [
          {
              url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
              filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
          },
          {
              url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
              filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
          }
      ]}
    )
    await camp.save()
  }
}
seedDB().then(()=>{
    mongoose.connection.close()
}
)