from .augmenter import KeywordAugmenter
from models import Keyword, KeywordSource
from typing import List
import gensim.downloader


class GloveKeywordAugmenter(KeywordAugmenter):
    def __init__(self, k: int = 5) -> None:
        self.k = k
        self.model = gensim.downloader.load("glove-wiki-gigaword-50")

    def augment(self, keywords: List[Keyword]) -> List[Keyword]:
        result: List[Keyword] = []
        for keyword in keywords:
            try:
                result += [
                    Keyword(value=kw, source=[KeywordSource.LANGUAGE_MODEL])
                    for kw, _ in self.model.most_similar(keyword.value, topn=self.k)
                ]
            except KeyError:
                pass
        return result
