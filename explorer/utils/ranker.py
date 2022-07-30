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
        indexed_scores.sort(key=lambda x: score.scores[x[0]], reverse=not score.reverse)
        result = [0 for x in indexed_scores]
        for rank, score in enumerate(indexed_scores):
            result[score[0]] = rank + 1
        return result

    def rank(self, scores_l: Score, scores_r: Score) -> List[float]:
        indexes_l = self._rank_elements(scores_l)
        indexes_r = self._rank_elements(scores_r)
        print(indexes_l)
        print(indexes_r)
        result = []
        for rank_l, rank_r in zip(indexes_l, indexes_r):
            result.append(
                ((1.0 / scores_l.weight) * rank_l) + ((1.0 / scores_r.weight) * rank_r)
            )
        return result
