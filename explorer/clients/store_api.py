import requests

from models import Stores, App, AppMetadata, Review, StoreCountry, ReviewSortCriteria
from typing import Optional, List


class StoreApiClient:
    def __init__(self, type: Stores, base_url: str):
        self.base_url = f"http://{base_url}/{type.value}"

    def get_app(self, id: str) -> Optional[App]:
        res = requests.get(f"{self.base_url}/app/{id}")
        if res.status_code == 200:
            id = res.json()["id"]
            return App(id=id, metadata=AppMetadata(**res.json()["metadata"]))
        return None

    def get_apps(self, ids: List[str]) -> List[Optional[App]]:
        return [self.get_app(id) for id in ids]

    def get_suggestions(self, query: str) -> List[str]:
        res = requests.get(f"{self.base_url}/suggestions", params={"query": query})
        if res.status_code == 200:
            return res.json()
        return []

    def get_reviews(
        self,
        id: str,
        country: Optional[StoreCountry] = None,
        sortCriteria: Optional[ReviewSortCriteria] = None,
    ) -> List[Review]:
        params = {}
        if country is not None:
            params["country"] = country.value
        if sortCriteria is not None:
            params["criteria"] = sortCriteria.value
        res = requests.get(f"{self.base_url}/reviews/{id}", params=params)
        if res.status_code == 200:
            return [Review(**el) for el in res.json()]
        return []

    def get_ranking(
        self,
        id: str,
        query: str,
        country: Optional[StoreCountry] = None,
    ) -> Optional[int]:
        params = {}
        params["query"] = query
        if country is not None:
            params["country"] = country.value

        res = requests.get(f"{self.base_url}/ranking/{id}", params=params)
        if res.status_code == 200:
            return res.json()["ranking"]
        return None

    def get_search_result(
        self, query: str, country: Optional[StoreCountry] = None, metadata: bool = False
    ) -> List[App]:
        params = {}
        params["query"] = query
        params["collectMetadata"] = "true" if metadata else "false"
        if country is not None:
            params["country"] = country.value
        res = requests.get(f"{self.base_url}/search", params=params)
        if res.status_code == 200:
            return [
                App(
                    id=el["id"],
                    metadata=(
                        AppMetadata(**el["metadata"]) if "metadata" in el else None
                    ),
                )
                for el in res.json()
            ]
        return None
