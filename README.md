# netdromm
Multi-channel websocket server.
Websockets server for OSC, MIDI, chat, video channels, shaders, webp streaming etc. made with nodejs

######Setup nodejs 7

``` sh
wget http://nodejs.org/dist/node-latest.tar.gz 
tar -xzf node-latest.tar.gz
cd node-7xx
./configure
make
sudo make install
```

On Raspberry Pi, it takes 4 hours :notes:

######Git workflow:
Fork and clone this your repo and copy it to /opt/

``` sh
git clone https://github.com/videodromm/netdromm (replace videodromm by your name)
cp -a netdromm/ /opt/
cd /opt/netdromm/
npm install -g mocha nodemon
npm install
npm start
```

Optional
copy netdromm to /etc/init.d/ to launch at startup
`cp /opt/netdromm/netdromm /etc/init.d/`

######Run tests
`npm test`

######Contribute
Code, than commit and push to your fork then do a pull request.

######Roadmap
- [x] Basic websocket broadcast
- [ ] Authentication
- [ ] Webp streaming
