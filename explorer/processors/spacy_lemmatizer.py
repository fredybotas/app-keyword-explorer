import spacy
from typing import List
from .processor import KeywordProcessor


class SpacyLemmatizerProcessor(KeywordProcessor):
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def process(self, keywords: List[str]) -> List[str]:
        doc = self.nlp(" ".join(keywords))
        result = []
        for token in doc:
            result.append(token.lemma_)
        return result
