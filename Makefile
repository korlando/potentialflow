start:
	pm2 start server.js --name="pf" -- -p 3000 --production
build:
	wepback -w
buildprod:
	webpack -p
