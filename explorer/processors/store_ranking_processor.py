from .processor import KeywordProcessor
from typing import List
from models import Keyword
from clients import StoreApiClient
import tqdm


class StoreRankingProcessor(KeywordProcessor):
    def __init__(self, appIds: List[str], client: StoreApiClient, limit: int):
        self.appIds = appIds
        self.apiClient = client
        self.limit = limit

    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        for kw in tqdm.tqdm(keywords[: self.limit]):
            ranking_dict = {}
            app_rankings = [
                (id, self.apiClient.get_ranking(id, kw.value)) for id in self.appIds
            ]
            for id, ranking in app_rankings:
                if ranking is not None:
                    ranking_dict[id] = ranking
            kw.app_ranking = ranking_dict
        return keywords
