const path = require('path')
const request = require('request');
const express = require('express');
const hbs = require('hbs')

const app = express();
const port = process.env.PORT || 3000

const  publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')

const address = process.argv[2]


app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Check you weather report here'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Weather',
        name: 'Aanchal Help'
    });
})

app.get('/weather', (req, res) => {
    let address = req.query.address
    if(!address){
        return res.send({
            error: 'Please provide the address for location'
        })
    }
    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send(error);
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
               return res.send(error);
            }
            res.send({
                location,
                forecast: forecastData,
                address: address
            });
            // res.send();
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
        text: 'Help article not found'
    });
})

app.get('*', (req, res) => {
    res.render('404',{
        text: 'My 404 page'
    });
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})