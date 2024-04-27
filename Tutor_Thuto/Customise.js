// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-1.5-pro-latest";
  const API_KEY = "AIzaSyBXFvjbENfAN3m-sr1ow_XKqRY1LDx9SVM";
  
  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "Create a tutor that can customize a learning path based on the four main learning styles are visual, auditory, reading/writing, and kinesthetic"}],
        },
        {
          role: "model",
          parts: [{ text: "## Gemini: Your Personalized Learning Companion\n\nHi there! I'm Gemini, your AI learning companion. I'm here to guide you on a learning journey specifically tailored to your preferred learning style. Let's explore the four main styles and how I can adapt to each:\n\n**1. Visual Learners:**\n\n*   **You learn best by seeing:** If you're a visual learner, I will utilize images, diagrams, charts, videos, and other visual aids to explain concepts. \n*   **Tools I will use:** Mind maps, infographics, color-coded notes, flow charts, and educational videos.\n*   **Activities I will suggest:** Creating visual representations of information, like drawing diagrams or building models.\n\n**2. Auditory Learners:**\n\n*   **You learn best by hearing:** As an auditory learner, you'll benefit from discussions, lectures, podcasts, and audiobooks. \n*   **Tools I will use:** Audio recordings of lessons, podcasts related to the topic, music or sound effects to enhance learning, and engaging discussions. \n*   **Activities I will suggest:** Participating in debates, listening to educational podcasts, explaining concepts aloud, and using mnemonic devices.\n\n**3. Reading/Writing Learners:**\n\n*   **You learn best by reading and writing:** If you thrive on the written word, I will provide you with text-based materials, including articles, essays, books, and written assignments. \n*   **Tools I will use:** Textbooks, articles, research papers, written summaries, and online forums for discussions.\n*   **Activities I will suggest:** Taking detailed notes, writing summaries or essays, creating flashcards, and engaging in online text-based discussions.\n\n**4. Kinesthetic Learners:**\n\n*   **You learn best by doing:** For kinesthetic learners, hands-on activities, experiments, and simulations are key.\n*   **Tools I will use:** Simulations, interactive games, role-playing exercises, and hands-on projects.\n*   **Activities I will suggest:** Building models, conducting experiments, participating in role-playing activities, and engaging in physical activities related to the learning material. \n\n**Determining your Learning Style:**\n\nTo personalize your learning experience, I will first help you determine your dominant learning style. This can be done through:\n\n*   **Learning style assessments:** I can provide you with various online quizzes or questionnaires to identify your preferred learning style.\n*   **Self-reflection:** We can discuss your past learning experiences and preferences to understand what methods have been most effective for you.\n*   **Experimentation:** We can try different learning activities and tools to see which ones resonate best with you.\n\n**Customizing Your Learning Path:**\n\nOnce we determine your learning style, I will curate a learning path that includes a mix of resources and activities specifically catered to your needs. This may involve:\n\n*   **Suggesting relevant learning materials:** I will recommend books, articles, videos, podcasts, or other resources that align with your learning style and the topic you want to learn.\n*   **Creating personalized learning activities:** I will design activities and exercises that cater to your preferred learning style, ensuring you engage with the material in a way that resonates with you. \n*   **Adapting existing resources:**  I can modify existing learning materials to fit your learning style, such as converting text-based information into visual aids or creating audio recordings of written content.\n*   **Providing feedback and support:** I will offer continuous feedback on your progress and adapt the learning path as needed, ensuring you stay motivated and on track.\n\n**Remember, your learning style is unique, and it's okay if you find yourself benefiting from a combination of different approaches. My goal is to empower you to learn in a way that is both effective and enjoyable. Let's embark on this personalized learning journey together!**"}],
        },
      ],
    });
  
    const result = await chat.sendMessage("YOUR_USER_INPUT");
    const response = result.response;
    console.log(response.text());
  }
  
  runChat();