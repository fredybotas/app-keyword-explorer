# app-keyword-explorer

Tool for app keyword exploration. Currently supports only US AppStore. Tool consists of 2 modules:
* scraper-api
  * node.js REST API providing interface for app stores 
  * internally uses [facundoolano/app-store-scraper](https://github.com/facundoolano/app-store-scraper) lib for access to AppStore data
  * this module also provides caching of AppStore requests and appropriate rate limiter
* explorer
  * Python module providing set of processors and augmenters for keywords manipulation

## scraper-api:
List of endpoints: 
* **/{store}/app/{appId}** - gets app metadata
* **/{store}/reviews/{appId}** - gets apps reviews (all accessible reviews sorted by helpfullness by default)
* **/{store}/ranking/{appId}?query={query}** - returns position of given app in search result of given query
* **/{store}/suggestions?query={query}** - returns app store search suggestions for given query
* **/{store}/search?query={query}&collectMetadata={metadata}** - returns search results of given query
    * Optional parameter collectMetadata, if true each search result row contains also app details. Otherwise only app ID is returned

Redis is used as cache. Rate limiting is applied only on app search queries with rate of approx 20 req/min (as apple recommend)

Possible values for {store} are 'appstore' or 'playstore' currently
## explorer
Python module performing keywords analysis. Analysis is done on set of given apps as user input.

Brief overview of algorithm:
* Collect App metadata (name, description of provided apps) and extract keywords from them
  * RATIONALE: It is possible that author of app may mention many keywords in name and description of the app
* Collect top reviews for each app sorted by helpfullness and extract keywords from them
  * RATIONALE: Users are prone to mention keywords that they used for app searching in reviews. 
    * E.g. user that found app by query: 'relaxing word game', may write review: This is the best relaxing word game on the market.
* For every collected keyword perform store suggestion query and collect new keywords based on suggestion results
    * RATIONALE: AppStore knowns what people are searching for, thus their recommendations may contain lot of relevant keywords for given query
* Augment yet collected keywords with language model. Collect closest words for each collected keyword.
  * RATIONALE: language models are good for exploring new words that are used in similar contexts as given keyword, so the may contain a lot of new relevant keywords as well.
* Calculate relevancy score for each keyword using language model
  * Cosine and euclidean distances are used to calculate relevancies (both combined with same weights)
  * We simply compare vector representation of apps metadata with vector representation of each keyword
* Perform search query for top 3000 keywords based on calculated relevancy
  * AppStore query limits are tightly limited, so we perform search requests only on most relevant keyords
* Create final list of keywords sorted by 3 criteria
  * Occurences count of each keyword
  * Keyword relevancy
  * Count of apps that are indexed with given keyword

After each step of new keyword collection we perform lemmatization on them.

### Components used
* gensim: glove language model for collecting new keywords
* fasttext: language model for calculating keyword relevancy
* yake: keyword extractor 
* spacy: tokenization, stop-words, lemmatization

# Results example
Top 20 keywords for word games based on given 10 popular word games on AppStore.
```json
[
  {"value": "word", "source": [{"type": "metadata", "occurences_count": 25}, {"type": "reviews", "occurences_count": 127}, {"type": "suggestions", "occurences_count": 47}, {"type": "model", "occurences_count": 6}], "app_ranking": {"1602799021": 45, "1603978681": 17, "1095569891": 10, "1369521645": 23, "1207472156": 2, "1483222663": 187}, "relevancy": 0.05419179042822619},
  {"value": "crossword", "source": [{"type": "metadata", "occurences_count": 3}, {"type": "suggestions", "occurences_count": 17}, {"type": "model", "occurences_count": 4}], "app_ranking": {"1603978681": 62, "1095569891": 53, "1453351862": 181, "1369521645": 85, "1207472156": 7, "1269460400": 159, "1483222663": 50}, "relevancy": 0.4289883802328046},
  {"value": "search", "source": [{"type": "metadata", "occurences_count": 4}, {"type": "reviews", "occurences_count": 16}, {"type": "suggestions", "occurences_count": 20}, {"type": "model", "occurences_count": 3}], "app_ranking": {"1603978681": 130, "1095569891": 89, "1369521645": 91, "1207472156": 77, "1483222663": 36}, "relevancy": 0.17139961372201706},
  {"value": "letter", "source": [{"type": "metadata", "occurences_count": 4}, {"type": "reviews", "occurences_count": 33}, {"type": "suggestions", "occurences_count": 12}, {"type": "model", "occurences_count": 2}], "app_ranking": {"1602799021": 31, "1603978681": 77, "1207472156": 5, "1245180154": 127, "1269460400": 70}, "relevancy": 0.3090182394147494},
  {"value": "puzzle", "source": [{"type": "metadata", "occurences_count": 4}, {"type": "reviews", "occurences_count": 24}, {"type": "suggestions", "occurences_count": 36}, {"type": "model", "occurences_count": 7}], "app_ranking": {"1603978681": 73, "1095569891": 77, "1369521645": 94, "1207472156": 31}, "relevancy": 0.15713861624090492},
  {"value": "game", "source": [{"type": "metadata", "occurences_count": 16}, {"type": "reviews", "occurences_count": 213}, {"type": "suggestions", "occurences_count": 313}, {"type": "model", "occurences_count": 8}], "app_ranking": {"1095569891": 39, "1369521645": 193, "1207472156": 16}, "relevancy": 0.060252714357698856},
  {"value": "connect", "source": [{"type": "metadata", "occurences_count": 3}, {"type": "reviews", "occurences_count": 3}, {"type": "suggestions", "occurences_count": 16}, {"type": "model", "occurences_count": 6}], "app_ranking": {"1603978681": 50, "1095569891": 43, "1369521645": 83, "1207472156": 65, "1483222663": 158}, "relevancy": 0.04224820503779476},
  {"value": "brain", "source": [{"type": "metadata", "occurences_count": 1}, {"type": "reviews", "occurences_count": 22}, {"type": "suggestions", "occurences_count": 12}, {"type": "model", "occurences_count": 1}], "app_ranking": {"1603978681": 85, "1095569891": 32, "1369521645": 89, "1207472156": 27, "1483222663": 184}, "relevancy": 0.41749070125955834},
  {"value": "world", "source": [{"type": "metadata", "occurences_count": 1}, {"type": "reviews", "occurences_count": 5}, {"type": "suggestions", "occurences_count": 32}, {"type": "model", "occurences_count": 1}], "app_ranking": {"1603978681": 71, "1095569891": 82, "1369521645": 100, "1207472156": 78}, "relevancy": 0.05062654105794815},
  {"value": "spelling", "source": [{"type": "reviews", "occurences_count": 8}, {"type": "suggestions", "occurences_count": 19}, {"type": "model", "occurences_count": 1}], "app_ranking": {"1603978681": 57, "1095569891": 40, "1369521645": 18, "1269460400": 131, "1483222663": 56}, "relevancy": 0.3944059618329084},
  {"value": "wow", "source": [{"type": "metadata", "occurences_count": 1}, {"type": "reviews", "occurences_count": 7}, {"type": "suggestions", "occurences_count": 10}, {"type": "model", "occurences_count": 1}], "app_ranking": {"1257539184": 73, "1453351862": 76, "1369521645": 1, "1269460400": 75, "1483222663": 7}, "relevancy": 0.17853011246257317},
  {"value": "guess", "source": [{"type": "metadata", "occurences_count": 3}, {"type": "reviews", "occurences_count": 12}, {"type": "suggestions", "occurences_count": 10}, {"type": "model", "occurences_count": 2}], "app_ranking": {"1602799021": 118, "1603978681": 94, "1095569891": 86, "1207472156": 42}, "relevancy": 0.014260997481112155},
  {"value": "fun", "source": [{"type": "metadata", "occurences_count": 1}, {"type": "reviews", "occurences_count": 58}, {"type": "suggestions", "occurences_count": 17}, {"type": "model", "occurences_count": 6}], "app_ranking": {"1603978681": 83, "1207472156": 94}, "relevancy": 0.03921774307305843},
  {"value": "scramble", "source": [{"type": "reviews", "occurences_count": 1}, {"type": "suggestions", "occurences_count": 7}, {"type": "model", "occurences_count": 4}], "app_ranking": {"1095569891": 19, "1369521645": 27, "1207472156": 3, "1245180154": 109, "1483222663": 88}, "relevancy": 0.24359591347014736},
  {"value": "adult", "source": [{"type": "reviews", "occurences_count": 1}, {"type": "suggestions", "occurences_count": 16}, {"type": "model", "occurences_count": 1}], "app_ranking": {"1603978681": 163, "1095569891": 100, "1369521645": 102, "1207472156": 94, "1483222663": 190}, "relevancy": 0.5047494288594122},
  {"value": "scrabble", "source": [{"type": "reviews", "occurences_count": 1}, {"type": "suggestions", "occurences_count": 11}], "app_ranking": {"1603978681": 30, "1095569891": 8, "1369521645": 72, "1207472156": 7, "1483222663": 80}, "relevancy": 0.36463612959108677},
  {"value": "work", "source": [{"type": "reviews", "occurences_count": 7}, {"type": "suggestions", "occurences_count": 3}, {"type": "model", "occurences_count": 6}], "app_ranking": {"1603978681": 196, "1095569891": 89, "1369521645": 94, "1207472156": 76}, "relevancy": 0.01194358539043143},
  {"value": "connection", "source": [{"type": "suggestions", "occurences_count": 1}, {"type": "model", "occurences_count": 4}], "app_ranking": {"1603978681": 99, "1095569891": 39, "1369521645": 47, "1207472156": 8, "1483222663": 136}, "relevancy": 0.15999081573712734},
  {"value": "cross", "source": [{"type": "reviews", "occurences_count": 1}, {"type": "suggestions", "occurences_count": 3}, {"type": "model", "occurences_count": 2}], "app_ranking": {"1603978681": 99, "1095569891": 28, "1369521645": 79, "1207472156": 5, "1483222663": 110}, "relevancy": 0.2940441920595816},
  {"value": "play", "source": [{"type": "metadata", "occurences_count": 5}, {"type": "reviews", "occurences_count": 80}, {"type": "suggestions", "occurences_count": 15}, {"type": "model", "occurences_count": 11}], "app_ranking": {"1369521645": 93}, "relevancy": 0.023530645843835053}
]
```
