from api.recommend import handler as recommend_handler

def handler(event, context):
    """Main handler for /api/recommend endpoints."""
    return recommend_handler(event, context)
