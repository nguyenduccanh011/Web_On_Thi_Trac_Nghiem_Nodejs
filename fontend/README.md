# fontend

Lưu ý:
1. Khi khởi chạy Vue lần đầu có thể bị lỗi "parsing error: no babel config file detected for" thì thực hiện như sau:

    - click Ctrl+, or from, File > Preferences > Settings, then type eslint in the search bar, find Edit in settings.json in Options.

    - Thêm đoạn code sau: 

    "eslint.workingDirectories": [
            {"mode": "auto"}
    ],


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
