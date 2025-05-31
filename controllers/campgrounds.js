
const { cloudinary } = require('../cloudinary');
const Campground=require('../models/campground');
const maptilerClient=require('@maptiler/client')
maptilerClient.config.apiKey=process.env.MAPTILER_API_KEY


module.exports.index=async (req,res)=>{ 
const camps= await Campground.find({})
res.render('campground/index',{camps})
}
module.exports.rendernewForm=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in')
        return res.redirect('/login')
    }
    res.render('campground/new')
}
module.exports.createcamp=async (req,res)=>{
    const getData=await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1})
    const camp=new Campground(req.body.campground)
    camp.geometry=getData.features[0].geometry
    camp.images= req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.author=req.user._id
    await camp.save()
    req.flash('success','successfully created new campground')
    res.redirect(`/camps/${camp._id}`) 
}
module.exports.showCampground = async (req, res,) => {
    const camp= await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/camps');
    }
    res.render('campground/show', { camp });
}
module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id)
    if(!camp){
        req.flash('error','no campgrounds found')
        res.redirect('/camps')
    }   
    res.render('campground/edit',{camp})
}

module.exports.editCamp=async(req,res)=>{
    console.log(req.body)
    const {id}=req.params;
    const campground=await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','you do not have permission to do that')
        return res.redirect(`/camps/${id}`)
    }
    const getData=await maptilerClient.geocoding.forward(req.body.campground.location,{limit:1})
    const camp=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    camp.geometry=getData.features[0].geometry
    const images=req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.images.push(...images)
    await camp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
        }
      await  camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','successfully updated campground')
    res.redirect(`/camps/${camp.id}`)
}
module.exports.deletecamp=async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','successfully deleted campground')
    res.redirect('/camps')
}