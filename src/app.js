const express = require('express')
const path = require('path')
const hbs = require('hbs')
const app= express()
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const port = process.env.PORT || 3000 //On heroku process.env.PORT will exist 
//but if we use it locally 3000 will exist and first one will not


//app.get('') it have 2 arguements:
//1. link we want to visit
    //eg. app.com
    //    app.com/help
//2. function that will be the output(html or json)
    //function also contains arguements
    //1. object with info about incoming request which is called req
    //2. response which is sent back to requester which is called res


console.log('check')

//we have made a static html file in public.Instead if writing in a string we will access a file.
console.log(__dirname) //this is showing the current path . To got to public directory :
console.log(path.join(__dirname,'../public')) //use the path 

const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath)) //when we use this as a route then the below app.get for route will not work

//hbs is used to make some dynamic templates
app.set('view engine','hbs') //first arguement should have the same val 'view engine'

//if we change the name of views folder to some other eg. template then it will give error because it finds the view folder.
//So to run with changed name we have to do the following:
const viewsPath = path.join(__dirname,'../template/views')
const partialsPath = path.join(__dirname,'../template/partials')
app.set('views',viewsPath) //changed the views path to template one
hbs.registerPartials(partialsPath)//takes the path to directory where partials live

//sending data to the page through hbs extension files to make it dynamic
app.get('',(req,res)=>{
    res.render('index',{
        name:'Ankita',
        title:'Weather App'
    }) //render is used for dynamic hbs files. It automatically checks in views folder
                        //It then converts it into html file and displays.
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'Cat',
        name:'meow'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Dog',
        name:'bhow'
    })
})


//visit 'localhost:3000'
//sending data inline as an json or html
app.get('/info',(req,res)=>{
    res.send({
        name:'Ankita',
        age:22
    })                          //send back json (object)
}) //visit 'localhost:3000/help

app.get('/infoArray',(req,res)=>{
    res.send([{
        name:'Ankita',
        age:22
    },
    {
        name:'abc',
        age:23
    }])     //send back json (array of objects)
})
app.get('/weather',(req,res)=>
{
    if(!req.query.address)
    {
        return res.send('You must provide an address')
    } 
    //whenever destructure it use default params
    geocode(req.query.address,(error,{longitude,latitude,location} = {})=>{
        if(error)
        {
            return res.send({ error })
        }
        forecast(longitude,latitude,(error,forecastdata) => {
            if(error)
            {
                return res.send({ error })
            }
            res.send({
                forecast:forecastdata,
                location,
                address:req.query.address
            })
        })    
    })
    
})

app.get('/products',(req,res)=>{
    req.send({
        products:[]
    })
})
app.get('/help/*',(req,res)=>{
    res.render('404',
    {
        title:'404',
        name:'Ankita',
        errorMessage:'Oops 404. Help page not found.'
    })
})
app.get('*',(req,res)=>{
    res.render('404',{
        name:'Ankita',
        title:'404',
        errorMessage:'Page not found'
    })
})
//when call it locally localhost:3000
// app.listen(3000 ,()=>{
//     console.log('Server is up on port 3000!')
// }) //port is 3000

//when using heroku
app.listen(port ,()=>{
    console.log('Server is up on port '+port)
})