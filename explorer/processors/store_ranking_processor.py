from .processor import KeywordProcessor
from typing import List
from models import Keyword
from clients import StoreApiClient


class StoreRankingProcessor(KeywordProcessor):
    def __init__(
        self,
        appIds: List[str],
        client: StoreApiClient,
    ):
        self.appIds = appIds
        self.apiClient = client

    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        for kw in keywords:
            ranking_dict = {}
            app_rankings = [
                (id, self.apiClient.get_ranking(id, kw.value)) for id in self.appIds
            ]
            for id, ranking in app_rankings:
                if ranking is not None:
                    ranking_dict[id] = ranking
            kw.app_ranking = ranking_dict
        return keywords
