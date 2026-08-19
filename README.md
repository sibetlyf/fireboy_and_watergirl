# 森林冰火人：首关双设备合作版

本版本只运行**森林教程第一关**，两位玩家使用两台设备合作：

- 第一台加入房间的设备控制**火人**；
- 第二台使用相同房间码加入，控制**冰人/水人**；
- 火人端执行原游戏的 Box2D 物理模拟，并把角色状态同步给冰人端；
- 第一关通过后播放七夕鹊桥、爱心与表白信结局演出。

> 使用或向公网重新分发原游戏资源前，请确认你拥有相应授权。

## 本地启动

```powershell
npm install
npm test
npm start
```

默认地址：`http://127.0.0.1:3000/`

两台设备连接到同一个服务器地址后，输入相同的房间码。例如：

```text
https://your-domain.example/?room=QIXI
```

第一台为火人，第二台为冰人。移动端推荐横屏操作；游戏自动使用原有的双人触控按键布局。

## 部署到服务器

服务器安装 Docker 和 Docker Compose 后，在项目目录执行：

```bash
docker compose up -d --build
```

服务默认监听 `3000` 端口。生产环境建议通过 Nginx/Caddy 反代到 `127.0.0.1:3000` 并启用 HTTPS，使 WebSocket 自动使用 WSS。

```bash
docker compose ps
docker compose logs -f
```

停止：

```bash
docker compose down
```
