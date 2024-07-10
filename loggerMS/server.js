const express = require("express");
const bodyParser = require("body-parser");

const Producer = require("./producer");
const producer = new Producer();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/sendLog', async (req, res, next) => {
    await producer.publishMessage(req.body.logType, req.body.message);
    res.status(200).send();
})

app.listen(PORT, () => {
    console.log("Server Running on PORT ", PORT);
})