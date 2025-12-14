import json
from typing import Any
import unidecode
import os

# English to Vietnamese tag mapping for common search terms
SEARCH_KEYWORDS = {
    'beach': ['bãi biển', 'biển', 'đảo', 'hải', 'sóng'],
    'culture': ['văn hóa', 'kiến trúc', 'lịch sử', 'cổ điển', 'di sản'],
    'history': ['lịch sử', 'cổ kính', 'di tích', 'lâu đài', 'pháo đài'],
    'nature': ['thiên nhiên', 'phong cảnh', 'rừng', 'núi', 'thác', 'suối', 'vườn'],
    'food': ['ẩm thực', 'ăn uống', 'nhà hàng', 'quán', 'food', 'cơm', 'phở'],
    'adventure': ['phiêu lưu', 'trekking', 'leo núi', 'canyoning', 'outdoor', 'thể thao'],
    'temple': ['chùa', 'tôn giáo', 'tín ngưỡng', 'đạo'],
    'landmark': ['biểu tượng', 'công trình', 'check-in', 'nổi tiếng'],
    'shopping': ['mua sắm', 'chợ', 'siêu thị', 'mall', 'shop'],
    'art': ['nghệ thuật', 'bảo tàng', 'tranh', 'điêu khắc'],
}

# Load database once
def load_database():
    """Load database from JSON file, trying multiple paths"""
    paths_to_try = [
        'backend/database.json',
        '../backend/database.json',
        './backend/database.json',
        os.path.join(os.path.dirname(__file__), '..', 'backend', 'database.json'),
    ]
    
    for path in paths_to_try:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data
        except Exception as e:
            continue
    
    # If all paths fail, return empty list
    return []

DB = load_database()

def handler(request):
    """Main API handler for Vercel"""
    try:
        # Set CORS headers
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        
        # Handle OPTIONS requests
        if request.method == 'OPTIONS':
            return ('', 200, headers)
        
        path = request.path
        
        # Parse body
        try:
            body = json.loads(request.get_data(as_text=True)) if request.get_data() else {}
        except:
            body = {}
        
        # Route requests
        if path.endswith('/api/recommend/interest'):
            return handle_recommend_interest(body, headers)
        elif path.endswith('/api/recommend/nearby'):
            return handle_recommend_nearby(body, headers)
        elif path.endswith('/api/recognize/landmark'):
            return handle_recognize_landmark(body, headers)
        elif path.endswith('/api/recognize/location'):
            return handle_recognize_location(body, headers)
        elif path == '/api' or path == '/api/':
            return (json.dumps({'message': 'VietNam UrbanQuest API', 'db_loaded': len(DB) > 0}), 200, headers)
        else:
            return (json.dumps({'error': 'Not found'}), 404, headers)
    except Exception as e:
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
        return (json.dumps({'error': str(e), 'success': False}), 500, headers)

def handle_recommend_interest(body: dict, headers: dict):
    try:
        interest = body.get('interest', '').lower()
        
        # Normalize search term
        interest_normalized = unidecode.unidecode(interest) if interest else ''
        
        recommendations = []
        
        if DB:
            # Get search keywords (Vietnamese terms to search for)
            search_terms = SEARCH_KEYWORDS.get(interest_normalized, [interest]) if interest_normalized else []
            
            # Search in database
            for dest in DB:
                tags = dest.get('tags', [])
                name = dest.get('name', '').lower()
                
                # Check if any search term matches tags or name
                match = False
                for search_term in search_terms:
                    search_normalized = unidecode.unidecode(search_term.lower())
                    
                    # Check tags
                    for tag in tags:
                        tag_normalized = unidecode.unidecode(tag.lower())
                        if search_normalized in tag_normalized or tag_normalized in search_normalized:
                            match = True
                            break
                    
                    if match:
                        break
                    
                    # Check name
                    if search_normalized in name or name in search_normalized:
                        match = True
                        break
                
                # Also match if interest is in Vietnamese and matches directly
                if not match and interest_normalized:
                    for tag in tags:
                        tag_normalized = unidecode.unidecode(tag.lower())
                        if interest_normalized in tag_normalized or tag_normalized in interest_normalized:
                            match = True
                            break
                
                if match:
                    recommendations.append({
                        'name': dest.get('name', 'Unknown'),
                        'description': dest.get('introduction', dest.get('description', '')),
                        'rating': dest.get('rating', 0),
                        'images': dest.get('images', []),
                        'image': dest.get('images', [''])[0] if dest.get('images') else '',
                        'tags': dest.get('tags', []),
                        'price': dest.get('price (VNĐ)', 0),
                        'location': dest.get('location', ''),
                        'province': dest.get('province', '')
                    })
                    
                    if len(recommendations) >= 6:
                        break
        
        response = {
            'success': True,
            'recommendations': recommendations[:6],
            'destinations': recommendations[:6],
            'message': f'Recommendations for {interest}' if interest else 'Top recommendations'
        }
        return (json.dumps(response, ensure_ascii=False), 200, headers)
    except Exception as e:
        return (json.dumps({'error': str(e), 'success': False}), 500, headers)

def handle_recommend_nearby(body: dict, headers: dict):
    try:
        # Get user location from body or use default (Hà Nội)
        user_lat = body.get('lat', 21.0285)
        user_lon = body.get('lon', 105.8542)
        
        nearby = []
        
        if DB:
            # Calculate distances and sort
            for dest in DB:
                dest_lat = dest.get('lat', 0)
                dest_lon = dest.get('lon', 0)
                
                # Simple distance calculation (not accurate but works for sorting)
                distance = ((dest_lat - user_lat) ** 2 + (dest_lon - user_lon) ** 2) ** 0.5
                
                nearby.append({
                    'name': dest.get('name', 'Unknown'),
                    'description': dest.get('introduction', dest.get('description', '')),
                    'distance': round(distance * 111, 1),  # Rough km conversion
                    'rating': dest.get('rating', 0),
                    'images': dest.get('images', []),
                    'image': dest.get('images', [''])[0] if dest.get('images') else '',
                    'lat': dest_lat,
                    'lon': dest_lon,
                    'tags': dest.get('tags', [])
                })
            
            # Sort by distance
            nearby.sort(key=lambda x: x['distance'])
            nearby = nearby[:3]
        
        response = {
            'success': True,
            'recommendations': nearby,
            'message': 'Nearby destinations'
        }
        return (json.dumps(response, ensure_ascii=False), 200, headers)
    except Exception as e:
        return (json.dumps({'error': str(e), 'success': False}), 500, headers)

def handle_recognize_landmark(body: dict, headers: dict):
    response = {
        'success': True,
        'landmark': 'Chùa Một Cột',
        'confidence': 0.85,
        'description': 'Một trong những công trình kiến trúc độc đáo của Hà Nội',
        'location': 'Hà Nội'
    }
    return (json.dumps(response, ensure_ascii=False), 200, headers)

def handle_recognize_location(body: dict, headers: dict):
    response = {
        'success': True,
        'location': 'Hà Nội, Vietnam',
        'confidence': 0.90,
        'coordinates': {'lat': 21.0285, 'lng': 105.8542}
    }
    return (json.dumps(response, ensure_ascii=False), 200, headers)
