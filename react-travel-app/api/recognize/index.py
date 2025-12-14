from api.recognize import handler as recognize_handler

def handler(event, context):
    """Main handler for /api/recognize endpoints."""
    return recognize_handler(event, context)
