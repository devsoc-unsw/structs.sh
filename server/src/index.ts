import express from 'express'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import { router } from './routes/dataStructureRouter'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(json())
app.use(router)


const connectionString = 'mongodb+srv://jinsunwoo:b6M4MmX5x6gt3y7l@structsdb.1rge7z4.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(connectionString).then(
    () => { console.log("Connected To Database") },
    err => { console.log("Could Not Connect to Database") }
)

app.listen(3000, () => {
    console.log("Listening on 3000")
})