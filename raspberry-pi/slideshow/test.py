import unittest
import os
import glob
from utils import getUsrPhotoUrls, downloadPhotos


class TestGetUrls (unittest.TestCase):
    def test_getUrls(self):
        result = getUsrPhotoUrls()

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 3)
        self.assertIsInstance(result[1], str)


class TestDownloadPhotos (unittest.TestCase):
    def test_downloadPhotos(self):

        # clear directory before running test
        reset = glob.glob("/home/domh/Pictures/temp/*")
        for file in reset:
            os.remove(file)

        previousUrls = [
            "https://cdn3.iconfinder.com/data/icons/eldorado-stroke-symbols/40/shape_square-512.png",
            "https://dictionary.cambridge.org/images/thumb/triang_noun_001_18172.jpg?version=5.0.70",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/1200px-Circle_-_black_simple.svg.png"]

        currentUrls = [
            "https://cdn3.iconfinder.com/data/icons/eldorado-stroke-symbols/40/shape_square-512.png",
            "https://dictionary.cambridge.org/images/thumb/triang_noun_001_18172.jpg?version=5.0.70",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/1200px-Circle_-_black_simple.svg.png",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Five-pointed_star.svg/2000px-Five-pointed_star.svg.png"]

        downloadPhotos(previousUrls, currentUrls)
        result = os.listdir("/home/domh/Pictures/temp")

        self.assertEqual(len(result), 4)


class TestDeletePhotos(unittest.TestCase):
    def test_delPics(self):

        reset = glob.glob("/home/domh/Pictures/temp/*")
        for file in reset:
            os.remove(file)

        testPreviousUrls = [
            "https://cdn3.iconfinder.com/data/icons/eldorado-stroke-symbols/40/shape_square-512.png",
            "https://dictionary.cambridge.org/images/thumb/triang_noun_001_18172.jpg?version=5.0.70",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Circle_-_black_simple.svg/1200px-Circle_-_black_simple.svg.png"]

        currentUrls = []

        downloadPhotos(testPreviousUrls, currentUrls)
        result = os.listdir("/home/domh/Pictures/temp")

        self.assertEqual(len(result), 0)


if __name__ == "__main__":
    unittest.main()
