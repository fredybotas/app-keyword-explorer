import spacy
from typing import List
from .processor import KeywordProcessor
from models import Keyword


class SpacyLemmatizerProcessor(KeywordProcessor):
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm", disable=["ner", "parser"])

    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        for kw in keywords:
            lemma = "".join([token.lemma_ for token in self.nlp(kw.value)])
            kw.value = lemma
        return keywords
