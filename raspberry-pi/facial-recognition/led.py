import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

def green_light_verfied():
    GPIO.setup(18,GPIO.OUT)
    GPIO.output(18, GPIO.HIGH)
    time.sleep(3)
    GPIO.output(18,GPIO.LOW)

def red_light(num):
    GPIO.setup(14,GPIO.OUT)
    print("LED ON")
    GPIO.output(14, GPIO.HIGH)
    time.sleep(num)
    print("LED OFF")
    GPIO.output(14,GPIO.LOW)
    
    

    