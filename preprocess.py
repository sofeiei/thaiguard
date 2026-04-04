import re
from pythainlp.tokenize import word_tokenize
from pythainlp.util import normalize

def preprocess_text(text):
    text = re.sub(r'[^ก-๙a-zA-Z0-9\s]', '', text)
    text = normalize(text)
    tokens = word_tokenize(text, engine='newmm')
    return ' '.join(tokens)