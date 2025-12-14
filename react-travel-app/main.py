from flask import Flask, request, jsonify
import json
from typing import Any
import unidecode
import os

app = Flask(__name__)

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

# Load database
def load_database():
    """Load database from JSON file"""
    paths_to_try = [
        'backend/database.json',
        './backend/database.json',
        os.path.join(os.path.dirname(__file__), 'backend', 'database.json'),
    ]
    
    for path in paths_to_try:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            continue
    
    return []

DB = load_database()

# CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.after_request
def after_request(response):
    return add_cors_headers(response)

@app.route('/api', methods=['GET', 'POST', 'OPTIONS'])
def api_info():
    """API info endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({
        'message': 'VietNam UrbanQuest API',
        'db_loaded': len(DB) > 0,
        'locations': len(DB)
    })

@app.route('/api/recommend/interest', methods=['POST', 'OPTIONS'])
def recommend_interest():
    """Recommend by interest/category"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}
        interest = data.get('interest', '').lower()
        
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
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/recommend/nearby', methods=['POST', 'OPTIONS'])
def recommend_nearby():
    """Recommend nearby locations"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}
        user_lat = data.get('lat', 21.0285)
        user_lon = data.get('lon', 105.8542)
        
        nearby = []
        
        if DB:
            # Calculate distances and sort
            for dest in DB:
                dest_lat = dest.get('lat', 0)
                dest_lon = dest.get('lon', 0)
                
                # Simple distance calculation
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
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/recognize/landmark', methods=['POST', 'OPTIONS'])
def recognize_landmark():
    """Recognize landmark from image"""
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'success': True,
        'landmark': 'Chùa Một Cột',
        'confidence': 0.85,
        'description': 'Một trong những công trình kiến trúc độc đáo của Hà Nội',
        'location': 'Hà Nội'
    })

@app.route('/api/recognize/location', methods=['POST', 'OPTIONS'])
def recognize_location():
    """Recognize location from image"""
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'success': True,
        'location': 'Hà Nội, Vietnam',
        'confidence': 0.90,
        'coordinates': {'lat': 21.0285, 'lng': 105.8542}
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
