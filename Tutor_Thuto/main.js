const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI("AIzaSyBXFvjbENfAN3m-sr1ow_XKqRY1LDx9SVM");



const model = genAI.getGenerativeModel({ model: "gemini-pro"});

console.log(model);