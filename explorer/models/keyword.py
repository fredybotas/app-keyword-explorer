from dataclasses import dataclass
import dataclasses
import enum
import json
from typing import List, Optional, Dict


class KeywordSourceType(str, enum.Enum):
    METADATA = "metadata"
    REVIEWS = "reviews"
    SUGGESTIONS = "suggestions"
    LANGUAGE_MODEL = "model"


@dataclass
class KeywordSource:
    type: KeywordSourceType
    occurences_count: int = 1


@dataclass
class Keyword:
    value: str
    source: List[KeywordSource]
    app_ranking: Dict[str, int] = None
    relevancy: Optional[float] = None

    def __repr__(self) -> str:
        return json.dumps(dataclasses.asdict(self))
