from .augmenter import KeywordAugmenter
from typing import List
from clients import StoreApiClient
from keywords import KeywordExtractor
from models import StoreCountry


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

    def augment(self, keywords: List[str]) -> List[str]:
        new_kws = []
        for keyword in keywords:
            suggestions = [
                self.extractor.extract(suggestion)
                for suggestion in self.apiClient.get_suggestions(keyword)
            ]
            suggestions = [item for sublist in suggestions for item in sublist]
            new_kws += suggestions
        return new_kws
