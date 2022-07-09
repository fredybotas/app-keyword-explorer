# from fasttext import load_model

# model = load_model('cc.en.300.bin')
# words = model.get_nearest_neighbors('word games', 50)

# for word in words:
#     print(word)

import gensim.downloader
print(list(gensim.downloader.info()['models'].keys()))
glove_vectors = gensim.downloader.load('glove-wiki-gigaword-50')
words = glove_vectors.most_similar('chipmunk', topn=100)

for wird in words:
    print(wird)