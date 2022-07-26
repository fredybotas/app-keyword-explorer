from models import StoreCountry, Stores, ReviewSortCriteria
from store_api import StoreApiClient

client = StoreApiClient(Stores.APPSTORE, "localhost:3000")

print(client.get_app("1497031062"))
print(client.get_suggestions("game"))
print(
    client.get_reviews(
        "1615840757", country=StoreCountry.SK, sortCriteria=ReviewSortCriteria.HELPFUL
    )
)
print(client.get_ranking("1615840757", "word games unlimited", StoreCountry.SK))
print(client.get_search_result("word games unlimited", StoreCountry.SK, metadata=True))
print(client.get_search_result("word games unlimited", StoreCountry.SK))
