from utils import Score, Ranker
from .processor import KeywordProcessor
import enum
from typing import List
from models import Keyword


class RankingCriteria(enum.Enum):
    OCCURENCE_COUNT = 1
    RELEVANCY_RANK = 2
    STORE_RANKING = 3


class RankingProcessor(KeywordProcessor):
    def __init__(self, *criteria: RankingCriteria):
        self.criteria = criteria

    def _get_rank_per_criteria(
        self, criteria: RankingCriteria, keywords: List[Keyword]
    ) -> Score:
        match criteria:
            case RankingCriteria.OCCURENCE_COUNT:
                return Score(
                    [
                        sum([source.occurences_count for source in kw.source])
                        for kw in keywords
                    ],
                    reverse=True,
                )
            case RankingCriteria.RELEVANCY_RANK:
                return Score([kw.relevancy for kw in keywords])
            case RankingCriteria.STORE_RANKING:
                return Score(
                    [
                        len(kw.app_ranking) if kw.app_ranking is not None else 0
                        for kw in keywords
                    ],
                    reverse=True,
                    weight=2.0,
                )
            case _:
                pass

    def process(self, keywords: List[Keyword]) -> List[Keyword]:
        scores = []
        for criteria in self.criteria:
            scores.append(self._get_rank_per_criteria(criteria, keywords))
        rank = Ranker().rank(*scores)
        return [
            value
            for _, value in sorted(enumerate(keywords), key=lambda kw: rank[kw[0]])
        ]
