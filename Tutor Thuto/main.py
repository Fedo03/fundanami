import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

from google.colab import userdata 



GOOGLE_API_KEY=userdata.get(AIzaSyBXFvjbENfAN3m-sr1ow_XKqRY1LDx9SVM)
genai.configure(api_key=GOOGLE_API_KEY)








