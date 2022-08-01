from dataclasses import dataclass
from typing import List


@dataclass
class Score:
    scores: List[float]
    reverse: bool = False
    weight: float = 1.0


class Ranker:
    def _rank_elements(self, score: Score) -> List[int]:
        indexed_scores = list(enumerate(score.scores))
        indexed_scores.sort(key=lambda x: score.scores[x[0]], reverse=score.reverse)
        result = [0 for x in indexed_scores]
        for rank, score in enumerate(indexed_scores):
            result[score[0]] = rank + 1
        return result

    def rank(self, *scores: List[Score]) -> List[float]:
        ranks = []
        for score in scores:
            ranks.append(self._rank_elements(score))
        result = []
        for el in zip(*ranks):
            result.append(sum(el))
        return result
