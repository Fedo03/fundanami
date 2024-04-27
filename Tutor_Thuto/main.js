const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const model = genAI.getGenerativeModel({ model: "gemini-pro"});

console.log(model);