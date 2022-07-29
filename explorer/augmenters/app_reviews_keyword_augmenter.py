from clients import StoreApiClient
from keywords import KeywordExtractor
from models import StoreCountry, Keyword, KeywordSource
from .augmenter import KeywordAugmenter
from typing import List


class AppReviewsKeywordAugmenter(KeywordAugmenter):
    TOP_N_REVIEWS = 20
    RATING_THRESHOLD = 3

    def __init__(
        self,
        appIds: List[str],
        client: StoreApiClient,
        extractor: KeywordExtractor,
        language: StoreCountry = StoreCountry.US,
    ):
        self.appIds = appIds
        self.apiClient = client
        self.extractor = extractor
        self.language = language

    def augment(self, keywords: List[Keyword]) -> List[Keyword]:
        result: List[Keyword] = []
        for appId in self.appIds:
            appReviews = self.apiClient.get_reviews(appId, country=self.language)
            for review in appReviews[: AppReviewsKeywordAugmenter.TOP_N_REVIEWS]:
                if review.rating < AppReviewsKeywordAugmenter.RATING_THRESHOLD:
                    continue
                result += [
                    Keyword(
                        value=val,
                        source=[KeywordSource.REVIEWS],
                    )
                    for val in self.extractor.extract(review.content)
                ]
                result += [
                    Keyword(
                        value=val,
                        source=[KeywordSource.REVIEWS],
                    )
                    for val in self.extractor.extract(review.title)
                ]
        return result
