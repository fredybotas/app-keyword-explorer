from utils import Ranker, Score
import pytest


def test_ranker():
    score_l = Score([0.2, 0.3, 0.1, 0.4, 0.5])
    score_r = Score([0.7, 0.5, 0.3, 1.0, 1.2], reverse=True)
    score_s = Score([0.1, 0.2, 0.3, 0.4, 0.5])
    sut = Ranker()

    # rank l [0.4, 0.6, 0.2, 0.8, 1.0]
    # rank r [0.6, 0.8, 1.0, 0.4, 0.2]
    # rank s [0.2, 0.4, 0.6, 0.8, 1.0]

    assert sut.rank(score_l, score_r, score_s) == pytest.approx(
        [1.2, 1.8, 1.8, 2.0, 2.2]
    )
