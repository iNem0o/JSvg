class JSVG {
    constructor(svg) {
        if (!svg) {
            this.$svg = new JNode("svg").$node;
            this.root = new JSprite(new JNode("g").attr("root", 1));
            this.root.setStage(this);
            this.$svg.append(this.root.$node);
        } else {
            this.$svg = svg;
            //TODO : apprentissage /  découverte
        }

        this.need_refresh = false;

        this.setFramerate();
        this.setTickrate(100);
    }

    trigger(event, params) {
        this.root.$node.trigger(event, params);
    };

    on(event_name, listener) {
        this.root.$node.on(event_name, listener);
    };

    setTickrate(fps) {
        var self=this;
        clearInterval(this.tick_interval);
        var interval_ms = 1000 / fps;
        var lastTick = performance.now(),
            tick = function () {
                var tick = performance.now();
                var params = [{
                    time_ratio: (tick - lastTick) / interval_ms
                }];
                self.trigger("tick", params);
                lastTick = tick;
            };
        this.tick_interval = setInterval(tick, interval_ms);
        return this;
    };

    setFramerate(fps) {
        this.fps = fps || "max";
        var self = this;
        var onEnterFrame = function () {
            //this.dispatchEvent(new Event("EnterFrame",this));
            if (self.need_refresh) {
                self.root.refresh();
                self.need_refresh = false;
            }
            if (self.fps == "max" && window.requestAnimationFrame) window.requestAnimationFrame(onEnterFrame);
        };

        clearInterval(this.fps_interval);
        if (this.fps == "max" && window.requestAnimationFrame) window.requestAnimationFrame(onEnterFrame);
        else {
            this.fps_interval = setInterval(onEnterFrame, 1000 / this.fps);
        }  // 50 fps
        return this;

    };

    askRefresh() {
        this.need_refresh = true;
    };

    getRoot() {
        return this.$svg;
    };

    setViewBox(x, y, l, h) {
        this.$svg.attr("viewBox", x + " " + y + " " + l + " " + h);
        return this;
    };

    addChild(child) {
        this.root.addChild(child);
        return this;
    };
}


class JKeyboard {
    constructor() {
        this.left = 37;
        this.right = 39;
        this.up = 38;
        this.down = 40;
        this.esc = 27;
        this.enter = 13;
        this.space = 32;
        this.keys = [];

        var self = this;
        $(document).on("keydown", function (e) {
            self.keys[e.which] = true;
            if (e.which != 116) {
                e.preventDefault();
                e.stopPropagation();
            }

        }).on("keyup", function (e) {
            self.keys[e.which] = false;
        });
    }

    isDown(which) {
        return this.keys[which] ? true : false;
    }

}

class JRect extends JNode{
    constructor(x, y, w, h) {
        super("rect");
        this.position(x, y)
            .attr({
                width: w,
                height: h
            });
    };
}

