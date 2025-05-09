from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time
import random

# --- Setup ---
options = Options()
options.add_argument("--headless")  # comment out if you want to see it run
driver = webdriver.Chrome(service=Service(), options=options)

# Replace this with your real registration page URL
REGISTER_URL = "https://sparkling-torte-fa544b.netlify.app/register"

# Fake user data
fake_users = [
    {"username": "testuser3", "password": "pass1234"},
    {"username": "testuser4", "password": "pass1234"},
    {"username": "testuser5", "password": "pass1234"},
    {"username": "testuser6", "password": "pass1234"},
    {"username": "testuser7", "password": "pass1234"},
    {"username": "testuser8", "password": "pass1234"},
    {"username": "testuser9", "password": "pass1234"}
]

def register_user(user):
    driver.get(REGISTER_URL)
    time.sleep(1.5)  # Wait for Angular to load

    # Locate fields by placeholder text
    username_field = driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Username"]')
    password_field = driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Password"]')
    
    username_field.send_keys(user["username"])
    password_field.send_keys(user["password"])

    # Submit form
    driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    time.sleep(2)

    print(f"[✓] Registered {user['username']}")

# Run registration for each fake user
for user in fake_users:
    register_user(user)
    time.sleep(random.uniform(1.5, 3.0))

driver.quit()

