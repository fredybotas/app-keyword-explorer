from keywords import YakeKeywordExtractor
from models import Stores
from clients import StoreApiClient
from augmenters import (
    AppMetadataKeywordAugmenter,
    AppReviewsKeywordAugmenter,
    StoreSuggestionsKeywordAugmenter,
    GloveKeywordAugmenter,
)
from processors import (
    DeduplicatorProcessor,
    SpacyLemmatizerProcessor,
    ContentBasedRelevancyProcessor,
    StoreRankingProcessor,
)
from pipeline import ProcessingPipeline

kw_extractor = YakeKeywordExtractor()
client = StoreApiClient(Stores.APPSTORE, "localhost:3000")
apps = ["1207472156", "1095569891"]
pipeline = ProcessingPipeline(
    [
        AppMetadataKeywordAugmenter(apps, client, kw_extractor),
        AppReviewsKeywordAugmenter(apps, client, kw_extractor),
        SpacyLemmatizerProcessor(),
        DeduplicatorProcessor(),
        StoreSuggestionsKeywordAugmenter(client, kw_extractor),
        SpacyLemmatizerProcessor(),
        DeduplicatorProcessor(),
        GloveKeywordAugmenter(),
        SpacyLemmatizerProcessor(),
        DeduplicatorProcessor(),
        ContentBasedRelevancyProcessor(apps, client),
        StoreRankingProcessor(apps, client, limit=2000),
    ]
)
pipeline.perform()

print(len(pipeline.keywords))
with open("keywords.txt", "w") as file:
    file.write("\n".join([kw.__repr__() for kw in pipeline.keywords]))
