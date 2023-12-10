from clients import StoreApiClient
from models import Stores, ListCategory, ListCollection, StoreCountry, App, AppMetadata
import datetime

from typing import List, Dict, Callable

client = StoreApiClient(Stores.APPSTORE, "localhost:3000")

all_categories = [val for val in ListCategory]
apps = []
apps_ids = set()
for category in all_categories:
    res = client.get_list_result(category=category, collection=ListCollection.TOP_FREE_IOS, country=StoreCountry.US, metadata=True)
    if res is not None:
        apps += res
result = []
for app in apps:
    if app.id not in apps_ids and app.metadata is not None:
        apps_ids.add(app.id)
        result.append(app)

def create_ranking(apps: List[App], attribute: Callable[[App], any], asc: bool) -> Dict[str, int]:
    apps_sorted = sorted(apps, key=attribute, reverse=not asc)
    result = dict()
    for id, app in enumerate(apps_sorted):
        result[app.id] = id + 1
    return result

def get_apps_based_on_ranking(apps: List[App], ranking: dict[str, int]) -> List[App]:
    return sorted(apps, key=lambda x: ranking[x.id])    

date_ranking = create_ranking(apps=result, attribute=lambda x: x.metadata.releaseDate, asc=False)
ratings_ranking = create_ranking(apps=result, attribute=lambda x: x.metadata.ratingsCount, asc=False)

final_ranking = dict()
for app in result:
    final_ranking[app.id] = (date_ranking[app.id]) + (ratings_ranking[app.id] * 0)
result = get_apps_based_on_ranking(result, final_ranking)

current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
with open(f"rankings_{current_datetime}.json", "w") as file:
    file.write("[" + ",\n".join([app.__repr__() for app in result]) + "]")
