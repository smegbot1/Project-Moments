
import boto3
import threading
import os
from utils import getUsrPhotoUrls, downloadPhotos, slideControl, initDownload


previousUrls = []
stock = True


def start():
    global previousUrls
    global stock
    # start slide show
    os.system('sh feh_stock.sh')
    os.system('sh recognition.sh')
    previousUrls = initDownload()
    if len(previousUrls) > 0:
        stock = False
        slideControl(stock)


def main():
    global previousUrls
    global stock
    threading.Timer(3.0, main).start()

    # get photo urls
    currentUrls = getUsrPhotoUrls()

    while currentUrls != previousUrls:

        if sorted(set(previousUrls)) != sorted(set(currentUrls)):
            # download photos
            
            tempUrls = previousUrls
            previousUrls = currentUrls
            stock = downloadPhotos(tempUrls, currentUrls)

            slideControl(stock)
        elif len(os.listdir("/home/pi/Pictures/temp")) < 1 and previousUrls == currentUrls:
            stock = downloadPhotos(previousUrls, currentUrls)
            slideControl(stock)

        else:
            slideControl(True)


start()
main()
