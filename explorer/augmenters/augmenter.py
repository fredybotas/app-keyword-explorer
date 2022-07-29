from typing import List

from models import Keyword


class KeywordAugmenter:
    def augment(self, keywords: List[Keyword]) -> List[Keyword]:
        raise NotImplementedError
