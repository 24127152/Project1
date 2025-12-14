# Vietnam UrbanQuest - Travel Web Application

A modern React-based travel web application for exploring Vietnam with AI-powered recommendations and landmark recognition.

## 🚀 Features

- **AI Recommendations**: Personalized travel suggestions based on user preferences
- **Landmark Recognition**: Upload photos to identify Vietnamese landmarks
- **Travel Albums**: Create and organize your travel memories
- **User Authentication**: Secure login and signup system
- **Responsive Design**: Works on all devices

## 📦 Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Styling**: Tailwind CSS (via CDN)
- **Backend**: Serverless Functions (Vercel/AWS Lambda compatible)
- **API**: Python FastAPI with Mangum adapter

## 🛠️ Local Development

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+ (for API functions)

### Installation

1. Clone the repository
```bash
cd react-travel-app
```

2. Install dependencies
```bash
npm install
```

3. Install Python dependencies (for local API testing)
```bash
pip install -r requirements.txt
```

4. Create environment file
```bash
cp .env.example .env
```

5. Start development server
```bash
npm start
```

The app will open at http://localhost:3000

## 🚀 Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Login to Vercel
```bash
vercel login
```

3. Deploy
```bash
vercel
```

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect settings
6. Click "Deploy"

### Environment Variables

Set these in Vercel Dashboard (Settings > Environment Variables):

- `JWT_SECRET_KEY`: Your secret key for JWT tokens
- `REACT_APP_API_URL`: `/api` (or your custom API URL)

## 📁 Project Structure

```
react-travel-app/
├── api/                    # Serverless API functions
│   ├── index.py           # Main API handler
│   ├── auth.py            # Authentication endpoints
│   ├── destinations.py    # Destinations & recommendations
│   └── albums.py          # Album management
├── public/                # Static files
│   └── index-react.html   # HTML template
├── src/
│   ├── components/        # React components
│   │   └── Navbar.js
│   ├── pages/             # Page components
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   ├── RecognizePage.js
│   │   ├── RecommendPage.js
│   │   └── AlbumsPage.js
│   ├── api.js             # Axios configuration
│   ├── index.js           # App entry point
│   ├── index.css          # Global styles
│   └── App.css            # App styles
├── vercel.json            # Vercel configuration
├── package.json           # Node dependencies
└── requirements.txt       # Python dependencies
```

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📝 API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/destinations` - Get all destinations
- `POST /api/recommend` - Get AI recommendations
- `GET /api/albums` - Get user albums
- `POST /api/albums` - Create/add to album
- `DELETE /api/albums` - Delete album

## 🎨 Customization

### Adding New Pages

1. Create component in `src/pages/YourPage.js`
2. Add route in `src/index.js`
3. Add navigation link in `src/components/Navbar.js`

### Adding New API Endpoints

1. Create function in `api/your_endpoint.py`
2. Add handler function
3. Export handler for Vercel

## 🐛 Troubleshooting

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: `node -v` (should be 16+)

### API Errors

- Check `requirements.txt` has all Python dependencies
- Verify environment variables are set in Vercel
- Check Vercel function logs in dashboard

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for Vietnam travel enthusiasts
