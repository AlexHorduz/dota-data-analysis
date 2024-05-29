import nltk

from transformers import RobertaTokenizer, RobertaForSequenceClassification

nltk.download('stopwords')
nltk.download('punkt')

RobertaTokenizer.from_pretrained("s-nlp/roberta_toxicity_classifier")
RobertaForSequenceClassification.from_pretrained("s-nlp/roberta_toxicity_classifier")