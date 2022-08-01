from dataclasses import dataclass
from typing import List

from numpy import Infinity
import math


@dataclass
class Score:
    scores: List[float]
    reverse: bool = False
    weight: float = 1.0


class Ranker:
    def _rank_elements(self, score: Score) -> List[int]:
        indexed_scores = list(enumerate(score.scores))
        indexed_scores.sort(key=lambda x: score.scores[x[0]], reverse=score.reverse)
        result = [0 for _ in indexed_scores]
        rank = 0
        prevScore = -Infinity
        for score in indexed_scores:
            if not math.isclose(score[1], prevScore):
                rank += 1
            prevScore = score[1]
            result[score[0]] = rank
        return result

    def rank(self, *scores: Score) -> List[float]:
        ranks = []
        for score in scores:
            ranked_elements = self._rank_elements(score)
            max_val = max(ranked_elements)
            ranked_elements_normalized = [
                score.weight * (el / max_val) for el in ranked_elements
            ]
            ranks.append(ranked_elements_normalized)
        result = []
        for el in zip(*ranks):
            result.append(sum(el))
        return result
