from .processor import KeywordProcessor
from typing import List
from models import Keyword


class DeduplicatorProcessor(KeywordProcessor):
    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        kw_to_source = {}
        for kw in keywords:
            if kw.value not in kw_to_source:
                kw_to_source[kw.value] = kw.source
            else:
                for src in kw.source:
                    if src not in kw_to_source[kw.value]:
                        kw_to_source[kw.value].append(src)

        return [
            Keyword(value=kw, source=list(sources))
            for kw, sources in kw_to_source.items()
        ]
