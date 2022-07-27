from keywords import YakeKeywordExtractor
from models import Stores
from clients import StoreApiClient
from augmenters import (
    AppMetadataKeywordAugmenter,
    AppReviewsKeywordAugmenter,
    StoreSuggestionsKeywordAugmenter,
)
from processors import DeduplicatorProcessor, SpacyLemmatizerProcessor
from pipeline import ProcessingPipeline


kw_extractor = YakeKeywordExtractor()
client = StoreApiClient(Stores.APPSTORE, "localhost:3000")

pipeline = ProcessingPipeline(
    [
        AppMetadataKeywordAugmenter(["1207472156", "1095569891"], client, kw_extractor),
        AppReviewsKeywordAugmenter(["1207472156", "1095569891"], client, kw_extractor),
        SpacyLemmatizerProcessor(),
        DeduplicatorProcessor(),
        StoreSuggestionsKeywordAugmenter(client, kw_extractor),
        SpacyLemmatizerProcessor(),
        DeduplicatorProcessor(),
    ]
)
pipeline.perform()

print(pipeline.keywords)

# print(client.get_app("1497031062"))
# print(client.get_suggestions("game"))
# print(
#     client.get_reviews(
#         "1615840757", country=StoreCountry.SK, sortCriteria=ReviewSortCriteria.HELPFUL
#     )
# )
# print(client.get_ranking("1615840757", "word games unlimited", StoreCountry.SK))
# print(client.get_search_result("word games unlimited", StoreCountry.SK, metadata=True))
# print(client.get_search_result("word games unlimited", StoreCountry.SK))
