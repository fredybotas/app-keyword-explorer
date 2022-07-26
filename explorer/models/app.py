from dataclasses import dataclass
from typing import Optional


@dataclass
class AppMetadata:
    name: str
    appId: str
    description: str


@dataclass
class App:
    id: str
    metadata: Optional[AppMetadata]
