const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const customerRoutes = require('./routes/customerRoutes')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api/customers', customerRoutes)

module.exports = app
