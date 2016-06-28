var term;
var buf = '';

function Wetty(opts, argv) {

    // Import Options
    this.argv_ = argv;
    this.pid_ = -1;

    // Connection Defaults
    var opts = {
      // SSH Connection
      username : opts.username || 'root',
      host: opts.host,
      // Socket.io Connection
      domain : opts.domain || 'http://localhost:3000' ,
      path : opts.path || '/wetty/socket.io',
    }

    // Create Query Object
    var query = "username="+opts.username;
    if (typeof opts.host !== "undefined")
      query = query + "&host=" + opts.host;

    // Create Socket
    this.socket = io(opts.domain, {path : opts.path, query : query});

    this.socket.on('connect', function() {
        var _this = this;

        lib.init(function() {
            hterm.defaultStorage = new lib.Storage.Local();
            term = new hterm.Terminal();
            window.term = term;
            term.decorate(document.getElementById('terminal'));

            term.setCursorPosition(0, 0);
            term.setCursorVisible(true);
            term.prefs_.set('ctrl-c-copy', true);
            term.prefs_.set('ctrl-v-paste', true);
            term.prefs_.set('use-default-window-copy', true);

            term.runCommandClass(Wetty, document.location.hash.substr(1));
            _this.socket.emit('resize', {
                col: term.screenSize.width,
                row: term.screenSize.height,
                height: document.getElementById('terminal').height,
                width: document.getElementById('terminal').width
            });

            if (buf && buf != '')
            {
                term.io.writeUTF16(buf);
                buf = '';
            }
        });
    });

    // Handles Interactive Prompts
    this.socket.on('prompt', function(data){
      if (!term){
        buf += data.prompt;
        return;
      }
      if (!data.echo){
        //todo hide user input
      }
      term.io.writeUTF16(data.prompt);
    });

    // Handles Regular Output
    this.socket.on('output', function(data) {
        if (!term) {
            buf += data;
            return;
        }
        term.io.writeUTF16(data);
    });

    this.socket.on('disconnect', function() {
        console.log("Socket.io connection closed");
    });
}

Wetty.prototype.run = function() {
    this.io = this.argv_.io.push();

    this.io.onVTKeystroke = this.sendString_.bind(this);
    this.io.sendString = this.sendString_.bind(this);
    this.io.onTerminalResize = this.onTerminalResize.bind(this);
}

Wetty.prototype.sendString_ = function(str) {
    this.socket.emit('input', str);
};

Wetty.prototype.onTerminalResize = function(col, row) {
    this.socket.emit('resize', { col: col, row: row, height: document.getElementById('terminal').height , width: document.getElementById('terminal').width});
};
