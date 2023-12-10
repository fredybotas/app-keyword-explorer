from dataclasses import dataclass
from typing import Optional
import datetime
import json
import dataclasses

@dataclass
class AppMetadata:
    name: str
    appId: str
    description: str
    releaseDate: datetime.datetime
    ratingsCount: int
    averageRating: float


@dataclass
class App:
    id: str
    metadata: Optional[AppMetadata]

    def __repr__(self) -> str:
        return json.dumps(dataclasses.asdict(self))
