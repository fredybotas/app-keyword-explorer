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
    RankingProcessor,
    RankingCriteria,
)
from pipeline import ProcessingPipeline
import datetime

kw_extractor = YakeKeywordExtractor()
client = StoreApiClient(Stores.APPSTORE, "localhost:3000")
apps = [
    "1602799021",
    "1603978681",
    "1095569891",
    "1257539184",
    "1453351862",
    "1369521645",
    "1207472156",
    "1245180154",
    "1269460400",
    "1483222663",
]
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
        RankingProcessor(
            RankingCriteria.OCCURENCE_COUNT, RankingCriteria.RELEVANCY_RANK
        ),
        StoreRankingProcessor(apps, client, limit=3000),
        RankingProcessor(
            RankingCriteria.STORE_RANKING,
            RankingCriteria.OCCURENCE_COUNT,
            RankingCriteria.RELEVANCY_RANK,
        ),
    ]
)
pipeline.perform()

print(len(pipeline.keywords))
current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
with open(f"keywords_{current_datetime}.json", "w") as file:
    file.write("[" + ",\n".join([kw.__repr__() for kw in pipeline.keywords]) + "]")
