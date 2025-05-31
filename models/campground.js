const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const Review=require('./reviews');
// const User=require('./user');
const { types, ref, required } = require('joi');
const { coordinates } = require('@maptiler/client');

const imageSchema=new Schema({
        url:String,
        filename:String
})

const opts = { toJSON: { virtuals: true } };
imageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload','/upload/w_200')
})
const campgroundShema=new Schema({
    geometry:{
        type:{
            type:String,
            required:true,
            enum:['Point']
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    name:String,
    images:[imageSchema],
    price:Number,
    description:String,
    location:String,
    author:{type:Schema.Types.ObjectId,ref:'User'},
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts)

campgroundShema.virtual('properties.popUpMarkup').get(function (){
    return    ` <strong><a href="/camps/${this._id}">${this.name}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
})
campgroundShema.post('findOneAndDelete',async function (docs) {
    if(docs){
       await Review.deleteMany({_id:{$in:docs.reviews}})
    }
    
})
module.exports=mongoose.model('Campground',campgroundShema)