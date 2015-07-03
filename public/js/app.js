var Vector;

Vector = (function() {
  function Vector(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  Vector.prototype.reverse = function() {
    return new Vector(-this.dx, -this.dy);
  };

  Vector.prototype.length = function() {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  };

  Vector.prototype.scale = function(xscalar, yscalar) {
    if (yscalar == null) {
      yscalar = xscalar;
    }
    return new Vector(this.dx * xscalar, this.dy * yscalar);
  };

  Vector.prototype.add = function(vector) {
    return new Vector(this.dx + vector.dx, this.dy + vector.dy);
  };

  Vector.prototype.dot = function(vector) {
    return this.dx * vector.dx + this.dy * vector.dy;
  };

  Vector.prototype.perpendicular = function() {
    return new Vector(-this.dy, this.dx);
  };

  Vector.prototype.copy = function() {
    return new Vector(this.dx, this.dy);
  };

  Vector.prototype.normalize = function() {
    return this.scale(1 / this.length());
  };

  return Vector;

})();

var Point;

Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.add = function(vector) {
    return new Point(this.x + vector.dx, this.y + vector.dy);
  };

  Point.prototype.to = function(point) {
    return new Vector(point.x - this.x, point.y - this.y);
  };

  Point.prototype.midpoint = function(point) {
    return new Point((point.x + this.x) / 2, (point.y + this.y) / 2);
  };

  Point.prototype.copy = function() {
    return new Point(this.x, this.y);
  };

  Point.prototype.toString = function() {
    return '(' + this.x + ',' + this.y + ')';
  };

  return Point;

})();

var Circle;

Circle = (function() {
  function Circle(stage, point, vector, radius, color1, image) {
    this.stage = stage;
    this.point = point != null ? point : new Point(0, 0);
    this.vector = vector != null ? vector : new Vector(0, 0);
    this.radius = radius != null ? radius : 0;
    this.color = color1;
    this.image = image;
    this.nugget = new createjs.Bitmap(this.image);
    this.circle = new createjs.Shape();
    this.colorCommand = this.circle.graphics.beginFill(this.color).command;
    this.circle.graphics.drawCircle(0, 0, this.radius);
    this.visible = false;
    this.drotation = Math.random() * 10 - 5;
  }

  Circle.prototype.move = function(t) {
    if (t == null) {
      t = 1;
    }
    this.point = this.point.add(this.vector.scale(t));
    this.circle.x = this.point.x;
    this.circle.y = this.point.y;
    this.nugget.x = this.point.x;
    this.nugget.y = this.point.y;
    return this.nugget.rotation += this.drotation;
  };

  Circle.prototype.draw = function() {
    this.nugget.regX = this.nugget.image.naturalWidth / 2;
    this.nugget.regY = this.nugget.image.naturalHeight / 2;
    this.scale = this.radius / Math.sqrt(this.nugget.image.naturalWidth * this.nugget.image.naturalHeight) * 2;
    this.nugget.scaleX = this.scale;
    this.nugget.scaleY = this.scale;
    this.stage.addChild(this.nugget);
    this.move(0);
    return this.visible = true;
  };

  Circle.prototype.remove = function() {
    this.stage.removeChild(this.circle);
    this.stage.removeChild(this.nugget);
    return this.visible = false;
  };

  Circle.prototype.setColor = function(color) {
    this.color = color;
    return this.colorCommand.style = color;
  };

  Circle.prototype.mass = function() {
    return this.radius * this.radius;
  };

  Circle.prototype.distance = function(circle) {
    return Math.sqrt(Math.pow(circle.point.x - this.point.x, 2) + Math.pow(circle.point.y - this.point.y, 2));
  };

  Circle.prototype.intersect = function(circle) {
    return Math.pow(circle.point.x - this.point.x, 2) + Math.pow(circle.point.y - this.point.y, 2) < Math.pow(circle.radius + this.radius, 2) && circle !== this;
  };

  return Circle;

})();

var image, imageURis, j, len, nugget, queue;

queue = new createjs.LoadQueue();

imageURis = (function() {
  var j, results;
  results = [];
  for (nugget = j = 1; j <= 5; nugget = ++j) {
    results.push('./img/nuggets/png/nugget' + nugget + '.png');
  }
  return results;
})();

for (j = 0, len = imageURis.length; j < len; j++) {
  image = imageURis[j];
  queue.loadFile(image);
}

queue.on('complete', function() {
  var circle, circleNum, circles, collide, collideTime, colors, frame, getImage, i, images, k, len1, randPoint, randVector, stage;
  $('#flowcanvas').attr('width', $(window).width().toString());
  $('#flowcanvas').attr('height', $(window).height().toString());
  stage = new createjs.Stage('flowcanvas');
  randPoint = function() {
    return new Point(Math.random() * $(window).width(), Math.random() * $(window).height());
  };
  randVector = function() {
    return new Vector(1000 * (Math.random() - .5), 1000 * (Math.random() - .5));
  };
  colors = [];
  colors = colors.concat((function() {
    var k, results;
    results = [];
    for (i = k = 0; k <= 5; i = ++k) {
      results.push('rgb(0,0,' + (45 * i + 40) + ')');
    }
    return results;
  })());
  getImage = function(uri) {
    image = new Image();
    image.src = uri;
    return image;
  };
  images = (function() {
    var k, results;
    results = [];
    for (nugget = k = 1; k <= 5; nugget = ++k) {
      results.push('./img/nuggets/png/nugget' + nugget + '.png');
    }
    return results;
  })();
  circleNum = ~~($(window).width() * $(window).height() / 13000);
  circles = (function() {
    var k, ref, results;
    results = [];
    for (i = k = 0, ref = circleNum; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      results.push(new Circle(stage, randPoint(), randVector(), 40 * Math.random() + 20, 'red', queue.getResult(imageURis[~~(Math.random() * 5)])));
    }
    return results;
  })();
  for (k = 0, len1 = circles.length; k < len1; k++) {
    circle = circles[k];
    circle.setColor(colors[~~(Math.random() * colors.length)]);
    circle.draw();
  }
  stage.update();
  collideTime = function(circle, other) {
    var p1x, p1y, p2x, p2y, r1, r2, v1x, v1y, v2x, v2y;
    p1x = circle.point.x;
    p1y = circle.point.y;
    v1x = circle.vector.dx;
    v1y = circle.vector.dy;
    r1 = circle.radius;
    p2x = other.point.x;
    p2y = other.point.y;
    v2x = other.vector.dx;
    v2y = other.vector.dy;
    r2 = other.radius;
    return (-p1x * v1x + p1x * v2x - p1y * v1y + p1y * v2y + p2x * v1x - p2x * v2x + p2y * v1y - p2y * v2y - Math.sqrt(-Math.pow(p1x, 2) * Math.pow(v1y, 2) + 2 * Math.pow(p1x, 2) * v1y * v2y - Math.pow(p1x, 2) * Math.pow(v2y, 2) + 2 * p1x * p1y * v1x * v1y - 2 * p1x * p1y * v1x * v2y - 2 * p1x * p1y * v1y * v2x + 2 * p1x * p1y * v2x * v2y + 2 * p1x * p2x * Math.pow(v1y, 2) - 4 * p1x * p2x * v1y * v2y + 2 * p1x * p2x * Math.pow(v2y, 2) - 2 * p1x * p2y * v1x * v1y + 2 * p1x * p2y * v1x * v2y + 2 * p1x * p2y * v1y * v2x - 2 * p1x * p2y * v2x * v2y - Math.pow(p1y, 2) * Math.pow(v1x, 2) + 2 * Math.pow(p1y, 2) * v1x * v2x - Math.pow(p1y, 2) * Math.pow(v2x, 2) - 2 * p1y * p2x * v1x * v1y + 2 * p1y * p2x * v1x * v2y + 2 * p1y * p2x * v1y * v2x - 2 * p1y * p2x * v2x * v2y + 2 * p1y * p2y * Math.pow(v1x, 2) - 4 * p1y * p2y * v1x * v2x + 2 * p1y * p2y * Math.pow(v2x, 2) - Math.pow(p2x, 2) * Math.pow(v1y, 2) + 2 * Math.pow(p2x, 2) * v1y * v2y - Math.pow(p2x, 2) * Math.pow(v2y, 2) + 2 * p2x * p2y * v1x * v1y - 2 * p2x * p2y * v1x * v2y - 2 * p2x * p2y * v1y * v2x + 2 * p2x * p2y * v2x * v2y - Math.pow(p2y, 2) * Math.pow(v1x, 2) + 2 * Math.pow(p2y, 2) * v1x * v2x - Math.pow(p2y, 2) * Math.pow(v2x, 2) + Math.pow(r1, 2) * Math.pow(v1x, 2) - 2 * Math.pow(r1, 2) * v1x * v2x + Math.pow(r1, 2) * Math.pow(v1y, 2) - 2 * Math.pow(r1, 2) * v1y * v2y + Math.pow(r1, 2) * Math.pow(v2x, 2) + Math.pow(r1, 2) * Math.pow(v2y, 2) + 2 * r1 * r2 * Math.pow(v1x, 2) - 4 * r1 * r2 * v1x * v2x + 2 * r1 * r2 * Math.pow(v1y, 2) - 4 * r1 * r2 * v1y * v2y + 2 * r1 * r2 * Math.pow(v2x, 2) + 2 * r1 * r2 * Math.pow(v2y, 2) + Math.pow(r2, 2) * Math.pow(v1x, 2) - 2 * Math.pow(r2, 2) * v1x * v2x + Math.pow(r2, 2) * Math.pow(v1y, 2) - 2 * Math.pow(r2, 2) * v1y * v2y + Math.pow(r2, 2) * Math.pow(v2x, 2) + Math.pow(r2, 2) * Math.pow(v2y, 2))) / (Math.pow(v1x, 2) - 2 * v1x * v2x + Math.pow(v1y, 2) - 2 * v1y * v2y + Math.pow(v2x, 2) + Math.pow(v2y, 2));
  };
  collide = function(circle, other) {
    var m1, m2, offset, rotationChange, un, ut, v1n, v1nprime, v1t, v2n, v2nprime, v2t;
    un = circle.point.to(other.point).normalize();
    ut = un.perpendicular();
    v1n = un.dot(circle.vector);
    v2n = un.dot(other.vector);
    v1t = ut.dot(circle.vector);
    v2t = ut.dot(other.vector);
    offset = un.scale((circle.radius + other.radius) - circle.distance(other) + 1);
    m1 = circle.mass();
    m2 = other.mass();
    circle.point = circle.point.add(offset.reverse().scale(m2 / (m1 + m2)));
    other.point = other.point.add(offset.scale(m1 / (m1 + m2)));
    v1nprime = un.scale((v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2));
    v2nprime = un.scale((v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2));
    circle.vector = v1nprime.add(ut.scale(v1t));
    other.vector = v2nprime.add(ut.scale(v2t));
    rotationChange = Math.random() * (circle.mass() + other.mass()) - (circle.mass() + other.mass()) / 2;
    circle.drotation += rotationChange / circle.mass();
    return other.drotation -= rotationChange / other.mass();
  };
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener('tick', frame = function(event) {
    var l, len2, len3, len4, len5, m, n, o, other, temp;
    if (event == null) {
      event = {
        delta: 1000
      };
    }
    temp = circles.slice(0);
    for (l = 0, len2 = circles.length; l < len2; l++) {
      circle = circles[l];
      circle.move(event.delta / 1000);
    }
    for (m = 0, len3 = circles.length; m < len3; m++) {
      circle = circles[m];
      if (circle.point.x - circle.radius < 0) {
        circle.vector = circle.vector.scale(-1, 1);
        circle.point.x = circle.radius;
      }
      if (circle.point.x + circle.radius > $(window).width()) {
        circle.vector = circle.vector.scale(-1, 1);
        circle.point.x = $(window).width() - circle.radius;
      }
      if (circle.point.y - circle.radius < 0) {
        circle.vector = circle.vector.scale(1, -1);
        circle.point.y = circle.radius;
      }
      if (circle.point.y + circle.radius > $(window).height()) {
        circle.vector = circle.vector.scale(1, -1);
        circle.point.y = $(window).height() - circle.radius;
      }
    }
    for (n = 0, len4 = circles.length; n < len4; n++) {
      circle = circles[n];
      for (o = 0, len5 = circles.length; o < len5; o++) {
        other = circles[o];
        if (circle.intersect(other)) {
          collide(circle, other);
        }
      }
    }
    circles = temp;
    return stage.update();
  });
  return $(window).bind('resize', function() {
    $('#flowcanvas').attr('width', $(window).width().toString());
    $('#flowcanvas').attr('height', $(window).height().toString());
    return stage.update();
  });
}, this);
