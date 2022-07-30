from dataclasses import dataclass
import enum
from typing import List, Optional


class KeywordSource(enum.Enum):
    METADATA = "metadata"
    REVIEWS = "reviews"
    SUGGESTIONS = "suggestions"
    LANGUAGE_MODEL = "model"


@dataclass
class Keyword:
    value: str
    source: List[KeywordSource]
    relevancy: Optional[float] = None

    def __repr__(self) -> str:
        return f"Keyword({self.value}, src={[v.value for v in self.source]}, rel={self.relevancy})"
