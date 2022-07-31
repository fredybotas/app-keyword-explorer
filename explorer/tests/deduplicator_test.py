from models import Keyword, KeywordSource, KeywordSourceType
from processors import DeduplicatorProcessor


def test_deduplicator_source_order():
    sut = DeduplicatorProcessor()
    kws = [
        Keyword("a", source=[KeywordSource(KeywordSourceType.LANGUAGE_MODEL)]),
        Keyword("a", source=[KeywordSource(KeywordSourceType.METADATA)]),
    ]
    assert sut.process(kws) == [
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL),
                KeywordSource(KeywordSourceType.METADATA),
            ],
        )
    ]


def test_deduplicator_same_sources():
    sut = DeduplicatorProcessor()
    kws = [
        Keyword("a", source=[KeywordSource(KeywordSourceType.LANGUAGE_MODEL)]),
        Keyword("a", source=[KeywordSource(KeywordSourceType.LANGUAGE_MODEL)]),
        Keyword("a", source=[KeywordSource(KeywordSourceType.LANGUAGE_MODEL)]),
    ]
    assert sut.process(kws) == [
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=3)
            ],
        )
    ]


def test_deduplicator_same_sources_different_occurences():
    sut = DeduplicatorProcessor()
    kws = [
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=3)
            ],
        ),
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=2)
            ],
        ),
    ]
    assert sut.process(kws) == [
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=5),
            ],
        )
    ]


def test_deduplicator_more_sources_different_occurences():
    sut = DeduplicatorProcessor()
    kws = [
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=3)
            ],
        ),
        Keyword(
            "a",
            source=[KeywordSource(KeywordSourceType.METADATA, occurences_count=10)],
        ),
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=2)
            ],
        ),
    ]
    assert sut.process(kws) == [
        Keyword(
            "a",
            source=[
                KeywordSource(KeywordSourceType.LANGUAGE_MODEL, occurences_count=5),
                KeywordSource(KeywordSourceType.METADATA, occurences_count=10),
            ],
        )
    ]
