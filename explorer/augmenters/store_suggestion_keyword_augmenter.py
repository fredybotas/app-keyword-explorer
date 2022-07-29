from .augmenter import KeywordAugmenter
from typing import List
from clients import StoreApiClient
from keywords import KeywordExtractor
from models import StoreCountry, Keyword, KeywordSource


class StoreSuggestionsKeywordAugmenter(KeywordAugmenter):
    def __init__(
        self,
        client: StoreApiClient,
        extractor: KeywordExtractor,
        language: StoreCountry = StoreCountry.US,
    ):
        self.apiClient = client
        self.extractor = extractor
        self.language = language

    def augment(self, keywords: List[Keyword]) -> List[Keyword]:
        new_kws: List[Keyword] = []
        for keyword in keywords:
            suggestions = [
                self.extractor.extract(suggestion)
                for suggestion in self.apiClient.get_suggestions(keyword.value)
            ]
            suggestions = [
                Keyword(value=item, source=[KeywordSource.SUGGESTIONS])
                for sublist in suggestions
                for item in sublist
            ]
            new_kws += suggestions
        return new_kws
