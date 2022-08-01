from utils import Ranker, Score


def test_ranker():
    score_l = Score([0.2, 0.3, 0.1, 0.4, 0.5])
    score_r = Score([0.7, 0.5, 0.3, 1.0, 1.2], reverse=True)
    score_s = Score([0.1, 0.2, 0.3, 0.4, 0.5])
    sut = Ranker()
    # rank l [2, 3, 1, 4, 5]
    # rank r [3, 4, 5, 2, 1]
    # rank s [1, 2, 3, 4, 5]

    assert sut.rank(score_l, score_r, score_s) == [6, 9, 9, 10, 11]
