from .processor import KeywordProcessor
from typing import List


class DeduplicatorProcessor(KeywordProcessor):
    def process(self, keywords: List[str]) -> List[str]:
        return list(set(keywords))
