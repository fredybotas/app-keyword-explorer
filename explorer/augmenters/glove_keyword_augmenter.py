from .augmenter import KeywordAugmenter

from typing import List
import gensim.downloader


class GloveKeywordAugmenter(KeywordAugmenter):
    def __init__(self, k: int = 5) -> None:
        self.k = k
        self.model = gensim.downloader.load("glove-wiki-gigaword-50")

    def augment(self, keywords: List[str]) -> List[str]:
        result = []
        for keyword in keywords:
            try:
                result += [
                    kw for kw, _ in self.model.most_similar(keyword, topn=self.k)
                ]
            except KeyError:
                pass
        return result
