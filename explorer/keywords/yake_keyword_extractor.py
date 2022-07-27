from .extractor import KeywordExtractor
from typing import List
import yake


class YakeKeywordExtractor(KeywordExtractor):
    def __init__(
        self,
        language: str = "en",
        n: int = 1,
        dedupLim: float = 0.9,
        dedupFunc: str = "seqm",
        windowsSize: int = 1,
        top: int = 10,
        features: None = None,
    ):
        self.extractor = yake.KeywordExtractor(
            lan=language,
            n=n,
            dedupLim=dedupLim,
            dedupFunc=dedupFunc,
            windowsSize=windowsSize,
            top=top,
            features=features,
        )

    def extract(self, text: str) -> List[str]:
        kws = [kw.split(" ") for kw, _ in self.extractor.extract_keywords(text)]
        return [item.lower() for sublist in kws for item in sublist]
