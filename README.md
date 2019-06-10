# Chatting-B05
2019 OS chatting web application

  **npm run buil: 버전**

  "build": "npm run build:linux && npm run build:osx && npm run build:win",
  
  "build:osx": "build --mac",
  
  "build:linux": "npm run build:linux32 && npm run build:linux64",
  
  "build:linux32": "build --linux --ia32",
  
  "build:linux64": "build --linux --x64",
  
  "build:win": "npm run build:win32 && npm run build:win64",
  
  "build:win32": "build --win --ia32",
  
  "build:win64": "build --win --x64"
    
