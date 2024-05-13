from typing import List

from transformers import RobertaTokenizer, RobertaForSequenceClassification
from torch.nn.functional import softmax
import torch


class ToxicityClassifier:
    def __init__(self):
        self.tokenizer = RobertaTokenizer.from_pretrained("s-nlp/roberta_toxicity_classifier")
        self.model = RobertaForSequenceClassification.from_pretrained("s-nlp/roberta_toxicity_classifier")
    

    def getToxicityPercentage(self, messages: List[str]) -> float:
        batch = self.tokenizer.batch_encode_plus(
            messages, 
            return_tensors="pt",
            padding=True,
            truncation=True,
        )["input_ids"]

        mask = torch.ones_like(batch)
        mask[batch == self.model.config.pad_token_id] = 0

        predictions = self.model(batch, mask)

        return softmax(predictions.logits, dim=1)[:, 1].mean().item() * 100