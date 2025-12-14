from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import hashlib
import jwt
import os
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs
from io import BytesIO

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# In-memory storage for demo (replace with database in production)
users_db = {
    "users": []
}

def hash_password(password: str) -> str:
    """Hash password using SHA256."""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password."""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict):
    """Create JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def handler(event, context):
    """AWS Lambda / Vercel handler for auth endpoints."""
    path = event.get('path', event.get('rawPath', ''))
    method = event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method', 'GET'))
    
    # Parse body
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except:
            pass
    
    # Route handling
    if path.endswith('/api/auth/signup') and method == 'POST':
        return signup(body)
    elif path.endswith('/api/auth/login') and method == 'POST':
        return login(body)
    elif path.endswith('/api/auth/me') and method == 'GET':
        headers = event.get('headers', {})
        return get_current_user(headers)
    else:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Not found'})
        }

def signup(data):
    """Handle user signup."""
    required_fields = ['fullname', 'email', 'password', 'phone']
    for field in required_fields:
        if not data.get(field):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'detail': f'Missing required field: {field}'})
            }
    
    # Check if user exists
    for user in users_db['users']:
        if user['email'] == data['email']:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'detail': 'Email already registered'})
            }
    
    # Create new user
    new_user = {
        'fullname': data['fullname'],
        'email': data['email'],
        'phone': data['phone'],
        'password': hash_password(data['password']),
        'created_at': datetime.utcnow().isoformat()
    }
    
    users_db['users'].append(new_user)
    
    # Create token
    token = create_access_token({'email': new_user['email']})
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'access_token': token,
            'token_type': 'bearer',
            'user': {
                'fullname': new_user['fullname'],
                'email': new_user['email'],
                'phone': new_user['phone']
            }
        })
    }

def login(data):
    """Handle user login."""
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Email and password required'})
        }
    
    # Find user
    user = None
    for u in users_db['users']:
        if u['email'] == email:
            user = u
            break
    
    if not user or not verify_password(password, user['password']):
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Invalid email or password'})
        }
    
    # Create token
    token = create_access_token({'email': user['email']})
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'access_token': token,
            'token_type': 'bearer',
            'user': {
                'fullname': user['fullname'],
                'email': user['email'],
                'phone': user['phone']
            }
        })
    }

def get_current_user(headers):
    """Get current user from token."""
    auth_header = headers.get('authorization') or headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Not authenticated'})
        }
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get('email')
        
        # Find user
        user = None
        for u in users_db['users']:
            if u['email'] == email:
                user = u
                break
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'detail': 'User not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'fullname': user['fullname'],
                'email': user['email'],
                'phone': user['phone']
            })
        }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Token expired'})
        }
    except jwt.JWTError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Invalid token'})
        }
