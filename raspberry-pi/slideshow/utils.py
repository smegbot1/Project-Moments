import urllib.request
import boto3
import shutil
import os
import glob

counter = 0
lib = {}
previousUser = ""
previousUrls = []


def getUsrPhotoUrls():
    global previousUser
    global counter
    global previousUrls
    global lib
    client = boto3.resource('dynamodb')
    # connect to table
    table = client.Table("Moments-prod")

    getCurrentUser = table.get_item(
        Key={"usr": "Active"}
    )

    currentUser = getCurrentUser["Item"]["refActive"]

    print(currentUser)

    response = table.get_item(
        Key={"usr": currentUser}
    )

    pictureUrls = response["Item"]["picURL"]

    if previousUser != currentUser:
        path = glob.glob("/home/pi/Pictures/temp/*")
        for item in path:
            os.remove(item)
        lib = {}
        previousUser = currentUser
        counter = 0

        print(len(os.listdir('/home/pi/Pictures/temp')),
              len(os.listdir('/home/pi/Pictures/temp')) == 0)
        return pictureUrls
    else:
        previousUrls = pictureUrls
        return previousUrls


def downloadPhotos(previousUrls, currentUrls):
    global counter

    additionalTotal = len(currentUrls) - len(previousUrls)
    if len(previousUrls) == 0 and len(currentUrls) == 0:
        return True

    elif len(os.listdir('/home/pi/Pictures/temp')) == 0:
        # download all current urls
        return addPhotosToStorage(list(currentUrls))
    elif additionalTotal > 0:

        return addPhotosToStorage(list(set(currentUrls) - set(previousUrls)))
    else:

        return deletePhotosFromStorage(list(set(previousUrls) - set(currentUrls)))


def slideControl(stock):
    if stock:
        os.system('sh kill.sh')
        os.system('sh feh_stock.sh')
    elif stock == False:
        os.system('sh kill.sh')
        os.system('sh script_slideshow.sh')


def addPhotosToStorage(additionalUrls):

    if len(additionalUrls) == 0:
        return True

    global counter
    global lib
    for url in additionalUrls:
        counter += 1
        urllib.request.urlretrieve(
            url, "/home/pi/Pictures/temp/{}.jpeg".format(counter))
        lib[url] = counter

    return False


def deletePhotosFromStorage(additionalUrls=[]):
    global lib

    if len(os.listdir('/home/pi/Pictures/temp')) == 0:
        return True
    else:
        for url in additionalUrls:
            os.remove("/home/pi/Pictures/temp/{}.jpeg".format(lib[url]))
            del lib[url]

        if len(os.listdir('/home/pi/Pictures/temp')) == 0:
            return True

        return False


def initDownload():
    # global counter
    initialUrls = getUsrPhotoUrls()
    addPhotosToStorage(initialUrls)
    return initialUrls
