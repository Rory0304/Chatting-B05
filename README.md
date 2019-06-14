# Chatting-B05
2019 OS chatting web application. 


## 톡오조
이름 | 분야 | 담당 
---|:---:|---:
`사은수` | backend | 서버 연동 DB 연결 서기
`이지선` | backend | DB 연결 패키징
`박성수` | frontend  | 디자인
`장윤호` | research | 라이센스 

## Installation
- git clone
- open the terminal and go to the directory
```
npm i
npm run build: "your os version"
```

  "build": "npm run build:linux && npm run build:osx && npm run build:win",
  
  "build:osx": "build --mac",
  
  "build:linux": "npm run build:linux32 && npm run build:linux64",
  
  "build:linux32": "build --linux --ia32",
  
  "build:linux64": "build --linux --x64",
  
  "build:win": "npm run build:win32 && npm run build:win64",
  
  "build:win32": "build --win --ia32",
  
  "build:win64": "build --win --x64"
    
## License
GPL v3.0
