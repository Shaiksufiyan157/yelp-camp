const express=require('express')
const router=express.Router()
const catchError=require('../utils/catchErrors')
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware') 
const campgrounds=require('../controllers/campgrounds') 
const multer=require('multer')
const {storage}=require('../cloudinary')
const upload=multer({storage})



router.route('/')
  .get(catchError(campgrounds.index))
  .post(isLoggedIn,upload.array('image'),validateCampground,catchError(campgrounds.createcamp))


router.get('/new',isLoggedIn,catchError(campgrounds.rendernewForm))

router.route('/:id')
  .get(catchError(campgrounds.showCampground))
  .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchError(campgrounds.editCamp))
  .delete(isLoggedIn,isAuthor,catchError(campgrounds.deletecamp))

router.get('/:id/edit',isLoggedIn,isAuthor,catchError(campgrounds.renderEditForm))


module.exports=router