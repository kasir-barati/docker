# A very to the point VPN for you

# Instructions:

1. `cp .env.example .env`
2. `docker-compose up`
3. `sudo apt install wireguard resolvconf`
4. `scp username@vpn_server-ip:WIREGUARD_DIRECTORY_PATH/config/peer1/peer1.conf .`
5. `sudo mv peer1.conf /etc/wireguard/wg0.conf`
6. `wg-quick up wg0`
7. `wg-quick down wg0`
