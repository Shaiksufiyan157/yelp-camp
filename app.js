if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const methodoverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressErrors')

const campgroundRouter=require('./routers/campground.js')
const reviewRouter=require('./routers/reviews.js')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user.js')
const userRoute=require('./routers/users.js')
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet')
// ||'mongodb://localhost:27017/yelp-camp'


mongoose.set('strictQuery', true);

const MongoDBStore = require('connect-mongo');

const dbUrl='mongodb://localhost:27017/yelp-camp'



mongoose.connect(dbUrl, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
});

const db =  mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const app=express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')))
// app.use(mongoSanitize({
// replaceWith:'_'}))


// app.use(session({
// secret:'thisshouldbeabettersecret!',
// cookie:{maxAge:60000},
// resave:false,
// saveUninitialized:false,
// store: new MongoDBStore.create({mongoUrl:dbUrl})

// }))

const store = MongoDBStore.create({
    mongoUrl: dbUrl,// this creates a session collection in mongo database
    // touchAfter: 24 * 60 * 60,
    // crypto: {
    //     secret: 'thisshouldbeabettersecret!'
    // }
collectionName:'session'
});
     app.use(session({
     secret: 'thisshouldbeabettersecret!',
     resave: false,
     saveUninitialized: true,
     store: store,
     cookie: {
        maxAge: 1000 * 60 * 60 * 24 //Equals 24 hours
     }
     }))



const sessionConfig={
    store,
    secret:'thisismsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        name:'session',
        httpOnly:true,
        // secure:true,----> this is for https (secure connection)
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}



app.use(session(sessionConfig))
app.use(flash())


app.use(express.urlencoded({extended:true}))
app.use(methodoverride('_method'))


app.use(helmet());





const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
     "https://cdn.jsdelivr.net/",

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    "https://api.maptiler.com/", // add this

];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
  "https://cdn.jsdelivr.net"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);











app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})


app.use('/camps',campgroundRouter)
app.use('/camps/:id/reviews',reviewRouter)
app.use('/',userRoute)

app.get('/',(req,res)=>{
res.render('home')})

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404))
    })
app.use((err,req,res,next)=>{
        const {statusCode=500}=err
        if(!err.message) err.message='oh no something went wrong'
        res.status(statusCode).render('error',{err})
    })
app.listen(3000,()=>{
    console.log("connection open on 3000")
})