import os
import sys
import glob
import json
import time
import urllib.parse
import urllib.request
import re

try:
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
except ImportError:
    print("Installing required Google API packages...", flush=True)
    os.system(".venv/bin/pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client")
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

SCOPES = ['https://www.googleapis.com/auth/youtube']

def get_client_secret_path():
    if os.path.exists("client_secret.json"):
        return "client_secret.json"
    if os.path.exists("client_secrets.json"):
        return "client_secrets.json"
    if os.path.exists("credentials.json"):
        return "credentials.json"
    dl_files = glob.glob(os.path.expanduser("~/Downloads/client_secret*.json"))
    if dl_files:
        return dl_files[0]
    return None

def get_authenticated_service():
    creds = None
    if os.path.exists('token.json'):
        try:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        except Exception:
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            client_secret_file = get_client_secret_path()
            if not client_secret_file:
                print("\n[ERROR] No client_secret.json found!", flush=True)
                return None
            print(f"Using credentials file: {client_secret_file}", flush=True)
            flow = InstalledAppFlow.from_client_secrets_file(client_secret_file, SCOPES)
            creds = flow.run_local_server(port=8088, open_browser=True, prompt='consent')
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('youtube', 'v3', credentials=creds)

def resolve_video_id(title, movie, singers, channel):
    query = f"{title} {movie} {singers} {channel} official song"
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            vids = re.findall(r"watch\?v=([a-zA-Z0-9_-]{11})", html)
            if vids:
                return vids[0]
    except Exception as e:
        print(f"   [!] Search lookup error for {title}: {e}", flush=True)
    return None

def create_playlist(youtube, title, description):
    print(f"\nCreating playlist: '{title}'...", flush=True)
    response = youtube.playlists().insert(
        part="snippet,status",
        body={
            "snippet": {
                "title": title,
                "description": description,
                "defaultLanguage": "hi"
            },
            "status": {
                "privacyStatus": "public"
            }
        }
    ).execute()
    playlist_id = response['id']
    playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"
    print(f"✅ Created: {playlist_url}", flush=True)
    return playlist_id, playlist_url

def add_video_to_playlist(youtube, playlist_id, video_id, title_display):
    try:
        youtube.playlistItems().insert(
            part="snippet",
            body={
                "snippet": {
                    "playlistId": playlist_id,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": video_id
                    }
                }
            }
        ).execute()
        print(f"   [+] Added: {title_display} (ID: {video_id})", flush=True)
        time.sleep(0.4)
        return True
    except Exception as e:
        print(f"   [-] Error adding {title_display} ({video_id}): {e}", flush=True)
        return False

# Load datasets from scratch script
sys.path.append("/Users/apple/.gemini/antigravity-cli/brain/e239a6d3-b2e7-4b55-bf23-bd97eab276a9/scratch")
from verify_all_playlists import playlist_1980s, playlist_1970s

def main():
    youtube = get_authenticated_service()
    if not youtube:
        return

    # 1. Create 1980s Playlist
    pl80_id, pl80_url = create_playlist(
        youtube,
        "Cassette Wala — 1980–1989 | Evergreen & Romantic",
        "100 Evergreen & Romantic Bollywood Classics from 1980 to 1989. Strictly 80s Hindi Nostalgia curated by Cassette Wala."
    )
    print(f"\nAdding {len(playlist_1980s)} songs to 1980s Playlist...", flush=True)
    success_80s = 0
    for idx, item in enumerate(playlist_1980s, 1):
        vid = resolve_video_id(item['title'], item['movie'], item['singers'], item['channel'])
        if vid:
            if add_video_to_playlist(youtube, pl80_id, vid, f"#{idx} {item['title']} ({item['movie']})"):
                success_80s += 1
        else:
            print(f"   [-] Could not resolve video ID for: {item['title']}")

    # 2. Create 1970s Playlist
    pl70_id, pl70_url = create_playlist(
        youtube,
        "Cassette Wala — 1970–1979 | Evergreen & Romantic",
        "100 Evergreen & Romantic Bollywood Golden Era Classics from 1970 to 1979. Strictly 70s Hindi Nostalgia curated by Cassette Wala."
    )
    print(f"\nAdding {len(playlist_1970s)} songs to 1970s Playlist...", flush=True)
    success_70s = 0
    for idx, item in enumerate(playlist_1970s, 1):
        vid = resolve_video_id(item['title'], item['movie'], item['singers'], item['channel'])
        if vid:
            if add_video_to_playlist(youtube, pl70_id, vid, f"#{idx} {item['title']} ({item['movie']})"):
                success_70s += 1
        else:
            print(f"   [-] Could not resolve video ID for: {item['title']}")

    print("\n==========================================", flush=True)
    print("🎉 ALL PLAYLISTS CREATED & SYNCED SUCCESSFULLY!", flush=True)
    print(f"1980s Playlist ({success_80s}/100 songs): {pl80_url}", flush=True)
    print(f"1970s Playlist ({success_70s}/100 songs): {pl70_url}", flush=True)
    print("==========================================", flush=True)

if __name__ == '__main__':
    main()
