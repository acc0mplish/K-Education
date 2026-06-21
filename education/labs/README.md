# 취약 랩 로컬 구성 (실습용)

## DVWA (Damn Vulnerable Web App)
docker run -d -p 8080:80 --name dvwa vulnerables/web-dvwa
# http://localhost:8080 (기본 admin/password)

## OWASP Juice Shop
docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop
# http://localhost:3000

## WebGoat
docker run -d -p 8081:8080 -p 9090:9090 --name webgoat webgoat/goatandwolf
# http://localhost:8081/WebGoat

> 모든 랩은 localhost 전용. 외부 노출 금지. RED PoC는 이 랩 또는 본인 소유 앱 대상.
