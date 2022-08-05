from .processor import KeywordProcessor
from typing import List
from models import Keyword
from utils import Ranker, Score
from clients import StoreApiClient
import fasttext
from scipy.spatial import distance


class ContentBasedRelevancyProcessor(KeywordProcessor):
    def __init__(
        self,
        appIds: List[str],
        client: StoreApiClient,
    ):
        self.model = fasttext.load_model("cc.en.300.bin")
        self.appIds = appIds
        self.apiClient = client

    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        apps = self.apiClient.get_apps(self.appIds)
        app_base_text: str = ""
        for app in apps:
            if app is not None and app.metadata is not None:
                app_base_text += app.metadata.name + " "
                app_base_text += app.metadata.description

        base_vector = self.model.get_sentence_vector(app_base_text.replace("\n", " "))
        cosine_rank = []
        euclidean_rank = []
        for kw in keywords:
            if kw.value in app_base_text:
                cosine_rank.append(0)
                euclidean_rank.append(0)
            else:
                kw_vector = self.model.get_sentence_vector(kw.value)
                cosine_rank.append(distance.cosine(kw_vector, base_vector))
                euclidean_rank.append(distance.euclidean(kw_vector, base_vector))

        rank_arr = Ranker().rank(Score(cosine_rank), Score(euclidean_rank))

        for rank, kw in zip(rank_arr, keywords):
            kw.relevancy = rank

        return keywords
