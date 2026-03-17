const mongoose = require("mongoose");
const sampleData = require("./sampleData.js");
const placeInfo = require("../models/placeInfo.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/greenHaven';


//connect mongodb 
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}


let initDB = async () => {
 sampleData.data =await sampleData.data.map((obj) => ({ ...obj, owner: "69b2e2c78ec7c608b2e380ec" }));
    await placeInfo.insertMany(sampleData.data);
    console.log(sampleData);
}
//initilize sample data run one time
initDB();

module.exports = placeInfo;
