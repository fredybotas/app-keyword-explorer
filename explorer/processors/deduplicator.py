from .processor import KeywordProcessor
from typing import List
from models import Keyword, KeywordSource


class DeduplicatorProcessor(KeywordProcessor):
    def _process_present_keyword(self, sources: List[KeywordSource], kw: Keyword):
        def src_contained(sources: List[KeywordSource], src: KeywordSource):
            return src.type.value in [s.type.value for s in sources]

        def update_source(sources: List[KeywordSource], src: KeywordSource, value: int):
            for s in sources:
                if s.type.value == src.type.value:
                    s.occurences_count += value

        for s in kw.source:
            if src_contained(sources, s):
                update_source(sources, s, s.occurences_count)
            else:
                sources.append(s)

    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        kw_to_source = {}
        for kw in keywords:
            if kw.value not in kw_to_source:
                kw_to_source[kw.value] = kw.source
            else:
                self._process_present_keyword(kw_to_source[kw.value], kw)

        return [
            Keyword(value=kw, source=sources) for kw, sources in kw_to_source.items()
        ]
