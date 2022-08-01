from .augmenter import KeywordAugmenter
from models import Keyword, KeywordSource, KeywordSourceType
from typing import List
import gensim.downloader
from gensim import parsing


class GloveKeywordAugmenter(KeywordAugmenter):
    def __init__(self, k: int = 5) -> None:
        self.k = k
        self.model = gensim.downloader.load("glove-wiki-gigaword-50")
        self.stop_words = parsing.preprocessing.STOPWORDS

    def augment(self, keywords: List[Keyword]) -> List[Keyword]:
        result: List[Keyword] = []
        for keyword in keywords:
            augmented_kw = []
            try:
                augmented_kw = [
                    kw for kw, _ in self.model.most_similar(keyword.value, topn=self.k)
                ]
            except KeyError:
                pass
            augmented_kw = [kw for kw in augmented_kw if kw != keyword.value]
            augmented_kw = [kw for kw in augmented_kw if kw not in self.stop_words]
            augmented_kw = [
                Keyword(
                    value=kw,
                    source=[KeywordSource(type=KeywordSourceType.LANGUAGE_MODEL)],
                )
                for kw in augmented_kw
            ]
            result += augmented_kw

        return result
