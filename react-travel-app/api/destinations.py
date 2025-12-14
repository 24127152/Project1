import json
import os

# Sample destinations data
destinations_data = [
    {
        "id": 1,
        "name": "Hà Nội",
        "description": "Thủ đô nghìn năm văn hiến với nhiều di tích lịch sử",
        "image": "https://images.unsplash.com/photo-1509030458227-e2d47a3f2a61",
        "category": "historical",
        "rating": 4.8
    },
    {
        "id": 2,
        "name": "Hạ Long",
        "description": "Vịnh biển đẹp với hàng ngàn đảo đá vôi",
        "image": "https://images.unsplash.com/photo-1528127269322-539801943592",
        "category": "nature",
        "rating": 4.9
    },
    {
        "id": 3,
        "name": "Sapa",
        "description": "Vùng núi cao với ruộng bậc thang tuyệt đẹp",
        "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
        "category": "nature",
        "rating": 4.7
    },
    {
        "id": 4,
        "name": "Hội An",
        "description": "Phố cổ đầy màu sắc với đèn lồng rực rỡ",
        "image": "https://images.unsplash.com/photo-1557750255-c76072a7aad1",
        "category": "cultural",
        "rating": 4.8
    },
    {
        "id": 5,
        "name": "TP. Hồ Chí Minh",
        "description": "Thành phố năng động với nhiều địa điểm tham quan",
        "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
        "category": "urban",
        "rating": 4.6
    },
    {
        "id": 6,
        "name": "Phú Quốc",
        "description": "Đảo ngọc với bãi biển tuyệt đẹp",
        "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        "category": "beach",
        "rating": 4.7
    }
]

def handler(event, context):
    """AWS Lambda / Vercel handler for destinations."""
    path = event.get('path', event.get('rawPath', ''))
    method = event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method', 'GET'))
    
    # Parse query parameters
    query_params = event.get('queryStringParameters') or {}
    
    if path.endswith('/api/destinations') and method == 'GET':
        return get_destinations(query_params)
    elif path.endswith('/api/recommend') and method == 'POST':
        body = {}
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except:
                pass
        return get_recommendations(body)
    else:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'detail': 'Not found'})
        }

def get_destinations(params):
    """Get all destinations with optional filtering."""
    category = params.get('category')
    
    filtered_destinations = destinations_data
    
    if category and category != 'all':
        filtered_destinations = [d for d in destinations_data if d['category'] == category]
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(filtered_destinations)
    }

def get_recommendations(data):
    """Get personalized recommendations based on preferences."""
    preferences = data.get('preferences', [])
    
    # Simple recommendation logic
    recommended = []
    
    for dest in destinations_data:
        if dest['category'] in preferences or not preferences:
            recommended.append(dest)
    
    # Sort by rating
    recommended.sort(key=lambda x: x['rating'], reverse=True)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({
            'recommendations': recommended[:6],
            'message': 'Recommendations based on your preferences'
        })
    }
