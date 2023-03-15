import express from 'express'
import { json } from 'body-parser'
import { todoRouter } from './routes/todo'

const app = express()

app.use(json())
app.use(todoRouter)


app.listen(3000, () => {
    console.log("Listening on 3000")
})

// import mongoose from "mongoose"


// mongoose.connect("mongodb+srv://jinsunwoo:b6M4MmX5x6gt3y7l@structsdb.1rge7z4.mongodb.net/?retryWrites=true&w=majority")