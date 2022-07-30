from utils import Ranker, Score


def test_rank():
    score_l = Score([0.2, 0.3, 0.1, 0.4, 0.5], reverse=True)
    score_r = Score([0.7, 0.5, 0.3, 1.0, 1.2])
    sut = Ranker()
    # rank l [2, 3, 1, 4, 5]
    # rank r [3, 4, 5, 2, 1]

    assert sut.rank(score_l, score_r) == [5, 7, 6, 6, 6]
