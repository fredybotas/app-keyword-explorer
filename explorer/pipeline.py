from typing import List, Union

from processors import KeywordProcessor
from augmenters import KeywordAugmenter

PipelineStep = Union[KeywordProcessor, KeywordAugmenter]


class ProcessingPipeline:
    def __init__(self, steps: List[PipelineStep]):
        self.steps = steps
        self.keywords = []

    def perform(self):
        for step in self.steps:
            if isinstance(step, KeywordProcessor):
                self.keywords = step.process(self.keywords)
            elif isinstance(step, KeywordAugmenter):
                self.keywords += step.augment(self.keywords)
