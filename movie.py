import requests
import psycopg2
from flask import Flask, jsonify

app = Flask(__name__)

# OMDB API and YouTube API keys
OMDB_API_KEY = 'fa9b977f'
YOUTUBE_API_KEY = 'AIzaSyDP59HxIQiO3Lxjmw3KbBviA08bfjrvgO8'

# PostgreSQL connection settings
DB_CONFIG = {
    'dbname': 'your_dbname',
    'user': 'your_dbuser',
    'password': 'your_dbpassword',
    'host': 'localhost',
    'port': 5432
}

# Connect to PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

# Function to fetch movie data from OMDb API
def get_movie_data_from_omdb(movie_name):
    url = f'http://www.omdbapi.com/?t={movie_name}&apikey={OMDB_API_KEY}'
    response = requests.get(url)
    data = response.json()
    
    if data['Response'] == 'True':
        return {
            'movie_name': data['Title'],
            'poster_url': data['Poster'],
            'plot': data['Plot'],
            'genre': data['Genre'],
            'director': data['Director'],
            'actors': data['Actors'],
            'language': data['Language'],
            'country': data['Country'],
            'release_date': data['Released'],
            'duration': int(data['Runtime'].split()[0]),
            'omdb_id': data['imdbID']
        }
    else:
        return None

# Function to fetch movie trailer and background image from YouTube API
def get_youtube_data(movie_name):
    search_url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={movie_name} trailer&key={YOUTUBE_API_KEY}'
    response = requests.get(search_url)
    data = response.json()

    if data['items']:
        trailer_url = f'https://www.youtube.com/watch?v={data["items"][0]["id"]["videoId"]}'
        background_url = data["items"][0]["snippet"]["thumbnails"]["high"]["url"]  # Wider image
        return trailer_url, background_url
    return None, None

# Insert movie data into PostgreSQL
def insert_movie_into_db(movie_data, trailer_url, background_url):
    conn = get_db_connection()
    cursor = conn.cursor()

    insert_query = '''
    INSERT INTO Movies (movie_name, poster_url, background_url, plot, genre, director, actors, language, country, 
                        release_date, duration, trailer_url, omdb_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    '''
    
    cursor.execute(insert_query, (
        movie_data['movie_name'], movie_data['poster_url'], background_url, movie_data['plot'], movie_data['genre'],
        movie_data['director'], movie_data['actors'], movie_data['language'], movie_data['country'], 
        movie_data['release_date'], movie_data['duration'], trailer_url, movie_data['omdb_id']
    ))
    
    conn.commit()
    cursor.close()
    conn.close()

# Fetch and insert 1000 Indian movies (can adjust as necessary)
@app.route('/populate_movies')
def populate_movies():
    movie_names = [
    "Hanuman", "Merry Christmas", "Captain Miller", "Mission Chapter 1", "Shri Swapankumarer Badami Hyenar Kobole",
    "Maati Putra", "Khurchi", "Bijoyar Pore", "Razaa-E-Ishq", "Jesus Revolution", "Munda Rockstar", "Qalb",
    "Saindhav", "Naa Saami Ranga", "Main Atal Hoon", "6 9 5", "The Beekeeper", "Aaichya Gavat Marathit Bol",
    "Ittaa Kittaa", "8 Don 75", "Kadal", "Barbarika", "Rangasamudra", "Klaantha", "Hubba", "Sentimentaaal", 
    "Mara Papa Superhero", "Anyone But You", "Tahi Banbe Mor Dulhaniya", "Night Swim", "Digimon Adventure 02: The Beginning",
    "Drame Aale", "Jai Bhim", "Kisi Ka Bhai Kisi Ki Jaan", "Satyaprem Ki Katha", "Tiger 3", "Dunki", 
    "Jawan", "Fukrey 3", "Bholaa", "Rocky Aur Rani Ki Prem Kahani", "Samrat Prithviraj", "Adipurush",
    "Tu Jhoothi Main Makkar", "Tumbbad", "Love Today", "Vikram Vedha", "Brahmastra", "Bhool Bhulaiyaa 2",
    "RRR", "Pushpa: The Rise", "Laal Singh Chaddha", "Gangubai Kathiawadi", "Chup", "Ponniyin Selvan II",
    "Vikram", "Gehraiyaan", "Cirkus", "Uunchai", "Drishyam 2", "Kabir Singh", "Badhaai Do", "Dhamaka",
    "Raksha Bandhan", "Gully Boy", "Andhadhun", "Tumbbad", "Shershaah", "Super 30", "Chhichhore", 
    "Dangal", "Lagaan", "3 Idiots", "Zindagi Na Milegi Dobara", "Dil Chahta Hai", "Piku", "Barfi!",
    "Bajrangi Bhaijaan", "Tanu Weds Manu", "Queen", "Kabhi Alvida Naa Kehna", "Kuch Kuch Hota Hai", 
    "Dilwale Dulhania Le Jayenge", "Hum Dil De Chuke Sanam", "Dil Se", "Jab We Met", "Bajirao Mastani", 
    "Padmaavat", "Bajirao Mastani", "Piku", "Gully Boy", "Ae Dil Hai Mushkil", "Barfi!", "Zindagi Na Milegi Dobara", 
    "Shubh Mangal Zyada Saavdhan", "Pati Patni Aur Woh", "Pee Loon", "Koi Mil Gaya", "Kabhi Khushi Kabhie Gham",
    "Chupke Chupke", "Madhur Bhandarkar's Fashion", "Tanu Weds Manu Returns", "Shershaah", "Goliyon Ki Raasleela Ram-Leela",
    "Hera Pheri", "Baahubali: The Beginning", "Baahubali: The Conclusion", "Baazigar", "Dhoom 3", 
    "Housefull", "Maine Pyaar Kiya", "Hum Aapke Hain Koun", "Madhuri Dixit in 'Dil To Pagal Hai'", "Hichki",
    "Pushpa 2: The Rule", 
    "Kanguva", 
    "Indian 2", 
    "Game Changer", 
    "Malaikottai Vaaliban", 
    "Viduthalai Part 2", 
    "Vettaiyan aka Thalaivar 170", 
    "Kalki 2898 AD", 
    "Devara Part 1", 
    "Captain Miller", 
    "Thalapat hy 68", 
    "Raghuthatha", 
    "Paayum Oli Nee Yenna", 
    "Vishnu Priya", 
    "Sultan", 
    "Vignesh", 
    "Nayagan", 
    "Vaanam Kottattum", 
    "Vikram Vedha 2", 
    "Kaatteri", 
    "Valimai 2", 
    "Bichagadu 2", 
    "Suriya 42", 
    "Udhayanidhi Stalin's film", 
    "Krithi", 
    "Lijo Jose Pellissery's film", 
    "Lalitham Sundaram", 
    "Ponniyin Selvan 3", 
    "Singa Penne", 
    "Rudra", 
    "Marudhamalai", 
    "Badava Rascal 2", 
    "Fighter", 
    "Nayakan", 
    "Sandeep Aur Pinky Faraar", 
    "Nakkalites", 
    "Dada", 
    "Arjuna Phalguna", 
    "Veeram", 
    "Kadhal Kottai", 
    "Maidaan", 
    "Sudheer Babu's Next", 
    "Thamizh", 
    "Shiva 2", 
    "Samrat Prithviraj's Biopic", 
    "Nadri", 
    "Thega", 
    "Asuravadham", 
    "Iraivi", 
    "Kamban", 
    "Vikram Vedha 2", 
    "Rajinikanth's Next", 
    "Vishnu", 
    "Yuganiki Okkadu", 
    "Peranbu 2", 
    "Zindagi"
]
# Replace with actual movie names or fetch from a list

    for movie_name in movie_names:
        # Step 1: Get data from OMDb API
        movie_data = get_movie_data_from_omdb(movie_name)
        if movie_data:
            # Step 2: Get YouTube data for trailer and background
            trailer_url, background_url = get_youtube_data(movie_name)
            if trailer_url and background_url:
                # Step 3: Insert data into PostgreSQL
                insert_movie_into_db(movie_data, trailer_url, background_url)

    return jsonify({"status": "Movies populated successfully!"})

if __name__ == '__main__':
    app.run(debug=True)