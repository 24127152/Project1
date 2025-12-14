import json

db = json.load(open('backend/database.json', 'r', encoding='utf-8'))

print('Sample tags:')
for i in range(min(3, len(db))):
    print(f'\n{db[i]["name"]}:')
    for tag in db[i].get('tags', [])[:5]:
        print(f'  - {tag}')
