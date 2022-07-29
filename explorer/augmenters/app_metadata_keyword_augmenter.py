from clients import StoreApiClient
from keywords import KeywordExtractor
from models import Keyword, KeywordSource

from .augmenter import KeywordAugmenter
from typing import List


class AppMetadataKeywordAugmenter(KeywordAugmenter):
    def __init__(
        self, appIds: List[str], client: StoreApiClient, extractor: KeywordExtractor
    ):
        self.appIds = appIds
        self.apiClient = client
        self.extractor = extractor

    def augment(self, keywords: List[Keyword]) -> List[Keyword]:
        result: List[Keyword] = []
        apps = self.apiClient.get_apps(self.appIds)
        for app in apps:
            if app.metadata is not None:
                result += [
                    Keyword(value=val, source=[KeywordSource.METADATA])
                    for val in self.extractor.extract(app.metadata.name)
                ]
                result += [
                    Keyword(value=val, source=[KeywordSource.METADATA])
                    for val in self.extractor.extract(app.metadata.description)
                ]
        return result
