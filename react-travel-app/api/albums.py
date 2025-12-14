import json
import base64
from datetime import datetime

# In-memory storage for albums (replace with database in production)
albums_storage = {}

def handler(event, context):
    """AWS Lambda / Vercel handler for albums."""
    path = event.get('path', event.get('rawPath', ''))
    method = event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method', 'GET'))
    
    # Get user from auth header
    headers = event.get('headers', {})
    user_email = get_user_from_token(headers)
    
    if not user_email:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Not authenticated'})
        }
    
    # Parse body
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except:
            pass
    
    # Route handling
    if method == 'GET' and '/albums' in path:
        return get_albums(user_email)
    elif method == 'POST' and '/albums' in path:
        return create_album(user_email, body)
    elif method == 'DELETE' and '/albums' in path:
        album_name = body.get('album_name')
        return delete_album(user_email, album_name)
    else:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Not found'})
        }

def get_user_from_token(headers):
    """Extract user email from JWT token."""
    auth_header = headers.get('authorization') or headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    # Simple token decode (use proper JWT in production)
    # For demo, we'll return a test email
    return "test@example.com"

def get_albums(user_email):
    """Get all albums for user."""
    user_albums = albums_storage.get(user_email, {})
    
    albums_list = []
    for album_name, items in user_albums.items():
        albums_list.append({
            'name': album_name,
            'count': len(items),
            'created_at': items[0].get('timestamp') if items else datetime.now().isoformat(),
            'items': items
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'albums': albums_list})
    }

def create_album(user_email, data):
    """Create or add to an album."""
    album_name = data.get('album_name', 'Default Album')
    image_data = data.get('image')
    landmark = data.get('landmark', 'Unknown')
    
    if user_email not in albums_storage:
        albums_storage[user_email] = {}
    
    if album_name not in albums_storage[user_email]:
        albums_storage[user_email][album_name] = []
    
    # Add item to album
    item = {
        'landmark': landmark,
        'timestamp': datetime.now().isoformat(),
        'image': image_data  # Base64 encoded image
    }
    
    albums_storage[user_email][album_name].append(item)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'message': f'Added to album: {album_name}',
            'album_name': album_name,
            'total_items': len(albums_storage[user_email][album_name])
        })
    }

def delete_album(user_email, album_name):
    """Delete an album."""
    if user_email in albums_storage and album_name in albums_storage[user_email]:
        del albums_storage[user_email][album_name]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': f'Album {album_name} deleted successfully'})
        }
    
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'detail': 'Album not found'})
    }
