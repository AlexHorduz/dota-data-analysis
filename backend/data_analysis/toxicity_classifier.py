from typing import List

from transformers import RobertaTokenizer, RobertaForSequenceClassification
from torch.nn.functional import softmax

class ToxicityClassifier:
    def __init__(self):
        self.tokenizer = RobertaTokenizer.from_pretrained("s-nlp/roberta_toxicity_classifier")
        self.model = RobertaForSequenceClassification.from_pretrained("s-nlp/roberta_toxicity_classifier")
    

    def getToxicityPercentage(self, messages: List[str]):
        batch = self.tokenizer.batch_encode_plus(
            messages, 
            return_tensors="pt"
        )["input_ids"]

        predictions = self.model(batch)
        
        # outputs are [neutral, toxic]
        return softmax(predictions.logits, dim=1)[:, 1].mean().item() * 100
    
    def update_data(self, rating_id: int):
        # TODO get N random matches on that rating and classify toxicity on them
        pass