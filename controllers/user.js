const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
    res.render('user/register')
}

module.exports.registerUser=async(req,res,next)=>{
try{
const {email,username,password}=req.body
const user=new User({email,username})
const newUser=await User.register(user,password)
req.login(newUser,err=>{
    if(err)return next(err)
        else{
            req.flash('success','Welcome')
            res.redirect('/camps')}
    })
}catch(e){
    req.flash('error',e.message)
    res.redirect('/register')
}}

module.exports.renderLogin=(req,res)=>{
    res.render('user/login')
}

module.exports.loginUser=(req,res)=>{
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/camps'; // update this line to use res.locals.returnTo now
    console.log(redirectUrl)
    res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res)=>{
    req.logout()
    req.flash('success','Goodbye')
    res.redirect('/camps')
}