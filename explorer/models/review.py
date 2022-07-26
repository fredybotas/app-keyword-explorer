from dataclasses import dataclass
import enum


@dataclass
class Review:
    title: str
    content: str
    rating: int


class ReviewSortCriteria(enum.Enum):
    RECENT = ("recent",)
    HELPFUL = ("helpful",)
