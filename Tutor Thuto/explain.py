"""
At the command line, only need to run once to install the package via pip:

$ pip install google-generativeai
"""

from pathlib import Path
import hashlib
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

uploaded_files = []
def upload_if_needed(pathname: str) -> list[str]:
  path = Path(pathname)
  hash_id = hashlib.sha256(path.read_bytes()).hexdigest()
  try:
    existing_file = genai.get_file(name=hash_id)
    return [existing_file.uri]
  except:
    pass
  uploaded_files.append(genai.upload_file(path=path, display_name=hash_id))
  return [uploaded_files[-1].uri]

convo = model.start_chat(history=[
  {
    "role": "user",
    "parts": ["a tutor who can recognize a picture of your notes and class work approvides an explaination based on a picked South African language and also provides an youtube and book resources to continue learning provide it in json format i want to use gooogle ai studeo for the ai which will teach"]
  },
  {
    "role": "model",
    "parts": ["```json\n{\n  \"description\": \"AI Tutor for South African Languages\",\n  \"features\": [\n    {\n      \"name\": \"Image Recognition\",\n      \"description\": \"Analyzes pictures of notes and classwork to understand the learning context.\"\n    },\n    {\n      \"name\": \"Language Selection\",\n      \"description\": \"Provides explanations in a chosen South African language (e.g., Afrikaans, isiZulu, isiXhosa, etc.).\"\n    },\n    {\n      \"name\": \"Explanation Generation\",\n      \"description\": \"Offers clear and concise explanations of the subject matter based on the recognized notes and chosen language.\"\n    },\n    {\n      \"name\": \"Resource Recommendation\",\n      \"description\": \"Suggests relevant YouTube videos and books for further exploration and learning.\" \n    }\n  ],\n  \"technology\": \"Google AI Studio\",\n  \"development_steps\": [\n    {\n      \"step\": 1,\n      \"description\": \"**Image Recognition Model:** Train a computer vision model using a dataset of handwritten notes and classwork images. This model should be able to identify key concepts, topics, and problems within the images.\"\n    },\n    {\n      \"step\": 2,\n      \"description\": \"**Language Understanding and Generation:** Integrate a Natural Language Processing (NLP) model capable of understanding and generating text in various South African languages. Consider using existing pre-trained models or training new ones specifically for this purpose.\"\n    },\n    {\n      \"step\": 3,\n      \"description\": \"**Explanation Engine:** Develop an explanation engine that combines information extracted from the image recognition model with the chosen language to provide comprehensive and understandable explanations.\"\n    },\n    {\n      \"step\": 4,\n      \"description\": \"**Resource Database:** Build a database of educational YouTube videos and books categorized by subject matter and South African language. This database will be used to recommend relevant resources to the user.\"\n    },\n    {\n      \"step\": 5,\n      \"description\": \"**User Interface:** Design a user-friendly interface within Google AI Studio that allows users to upload images, select their language, receive explanations, and access recommended resources.\"\n    }\n  ],\n  \"additional_considerations\": [\n    {\n      \"point\": \"Data Collection: Gathering a diverse and representative dataset of handwritten notes and classwork will be crucial for the accuracy of the image recognition model.\" \n    },\n    {\n      \"point\": \"Language Support: Ensure comprehensive coverage of South African languages by including various dialects and regional variations.\" \n    },\n    {\n      \"point\": \"Accessibility: Design the user interface and explanations to be accessible for users with different learning styles and abilities.\"\n    }\n  ] \n}\n```"]
  },
  {
    "role": "user",
    "parts": upload_if_needed("<path>/image0.png")
  },
  {
    "role": "user",
    "parts": [" show me an example with this picture"]
  },
  {
    "role": "model",
    "parts": ["## Example Analysis of Organic Chemistry Notes (English)\n\n**Recognized Content:**\n\nThe image appears to be notes on organic chemistry, specifically focusing on:\n\n* **Homologous Series:** A group of organic compounds with the same general formula and similar chemical properties, differing by a CH2 unit.\n* **Functional Groups:** Specific groups of atoms within molecules that are responsible for the characteristic reactions of those molecules. \n* **Examples of Homologous Series:** The notes include alkanes, alkenes, alkynes, alcohols, aldehydes, ketones, and carboxylic acids. \n* **Structural Formulas:** The notes show the expanded structural formulas of molecules from each homologous series, highlighting the functional groups. \n* **Molecular Formulas:**  The notes also provide the molecular formula for a representative member of each series.\n\n**Explanation (English):**\n\nThe notes provide a basic overview of the different types of organic compounds classified by their functional groups.  Each homologous series has a specific functional group that determines its properties.  For example, alkanes have single bonds and are relatively unreactive, while alkenes have a carbon-carbon double bond and are more reactive.  Alcohols contain a hydroxyl (-OH) group, aldehydes and ketones contain a carbonyl (C=O) group, and carboxylic acids have a carboxyl (-COOH) group. \n\n**Additional Resources:**\n\n* **YouTube:**\n    * Crash Course Organic Chemistry: https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQwypX\n    * Khan Academy Organic Chemistry: https://www.khanacademy.org/science/chemistry/organic-chemistry\n* **Books:**\n    * Organic Chemistry by Paula Yurkanis Bruice\n    * Organic Chemistry by Kenneth L. Williamson\n\n**Adapting to South African Languages:**\n\nTo adapt this example to a specific South African language, the explanation would need to be translated and relevant educational resources in that language would need to be identified. \n\n**Note:** This is a basic example. The level of detail and complexity of the explanation can be adjusted based on the student's level of understanding and the specific content of the notes."]
  },
])

convo.send_message("YOUR_USER_INPUT")
print(convo.last.text)
for uploaded_file in uploaded_files:
  genai.delete_file(name=uploaded_file.name)