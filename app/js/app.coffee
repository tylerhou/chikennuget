queue = new createjs.LoadQueue()
imageURis = ('./img/nuggets/png/nugget' + nugget + '.png' for nugget in [1..5])
for image in imageURis
  queue.loadFile(image)
queue.on('complete', ->
  $('#flowcanvas').attr('width', $(window).width().toString())
  $('#flowcanvas').attr('height', $(window).height().toString())
  stage = new createjs.Stage('flowcanvas')
  randPoint = -> new Point(Math.random()*$(window).width(), Math.random()*$(window).height())
  randVector = -> new Vector(1000*(Math.random()-.5), 1000*(Math.random()-.5))
  colors = []
  #colors = colors.concat('rgb(' + (45*i+40) + ',0,0)' for i in [0..5]) # red
  #colors = colors.concat('rgb(0,' + (45*i+40) + ',0)' for i in [0..5]) # green
  colors = colors.concat('rgb(0,0,' + (45*i+40) + ')' for i in [0..5]) # blue

  getImage = (uri) ->
    image = new Image()
    image.src = uri
    return image

  images = ('./img/nuggets/png/nugget' + nugget + '.png' for nugget in [1..5])

  circleNum = ~~($(window).width() * $(window).height() / 13000)
  circles = (new Circle(stage, randPoint(), randVector(), 40*Math.random()+20, 'red', queue.getResult(imageURis[~~(Math.random()*5)])) for i in [0...circleNum])
  for circle in circles
    circle.setColor(colors[~~(Math.random()*colors.length)])
    circle.draw()
  stage.update()

  collideTime = (circle, other) ->
    p1x = circle.point.x
    p1y = circle.point.y
    v1x = circle.vector.dx
    v1y = circle.vector.dy
    r1 = circle.radius
    p2x = other.point.x
    p2y = other.point.y
    v2x = other.vector.dx
    v2y = other.vector.dy
    r2 = other.radius
    (-p1x*v1x + p1x*v2x - p1y*v1y + p1y*v2y + p2x*v1x - p2x*v2x + p2y*v1y - p2y*v2y - Math.sqrt(-Math.pow(p1x, 2)*Math.pow(v1y, 2) + 2*Math.pow(p1x, 2)*v1y*v2y - Math.pow(p1x, 2)*Math.pow(v2y, 2) + 2*p1x*p1y*v1x*v1y - 2*p1x*p1y*v1x*v2y - 2*p1x*p1y*v1y*v2x + 2*p1x*p1y*v2x*v2y + 2*p1x*p2x*Math.pow(v1y, 2) - 4*p1x*p2x*v1y*v2y + 2*p1x*p2x*Math.pow(v2y, 2) - 2*p1x*p2y*v1x*v1y + 2*p1x*p2y*v1x*v2y + 2*p1x*p2y*v1y*v2x - 2*p1x*p2y*v2x*v2y - Math.pow(p1y, 2)*Math.pow(v1x, 2) + 2*Math.pow(p1y, 2)*v1x*v2x - Math.pow(p1y, 2)*Math.pow(v2x, 2) - 2*p1y*p2x*v1x*v1y + 2*p1y*p2x*v1x*v2y + 2*p1y*p2x*v1y*v2x - 2*p1y*p2x*v2x*v2y + 2*p1y*p2y*Math.pow(v1x, 2) - 4*p1y*p2y*v1x*v2x + 2*p1y*p2y*Math.pow(v2x, 2) - Math.pow(p2x, 2)*Math.pow(v1y, 2) + 2*Math.pow(p2x, 2)*v1y*v2y - Math.pow(p2x, 2)*Math.pow(v2y, 2) + 2*p2x*p2y*v1x*v1y - 2*p2x*p2y*v1x*v2y - 2*p2x*p2y*v1y*v2x + 2*p2x*p2y*v2x*v2y - Math.pow(p2y, 2)*Math.pow(v1x, 2) + 2*Math.pow(p2y, 2)*v1x*v2x - Math.pow(p2y, 2)*Math.pow(v2x, 2) + Math.pow(r1, 2)*Math.pow(v1x, 2) - 2*Math.pow(r1, 2)*v1x*v2x + Math.pow(r1, 2)*Math.pow(v1y, 2) - 2*Math.pow(r1, 2)*v1y*v2y + Math.pow(r1, 2)*Math.pow(v2x, 2) + Math.pow(r1, 2)*Math.pow(v2y, 2) + 2*r1*r2*Math.pow(v1x, 2) - 4*r1*r2*v1x*v2x + 2*r1*r2*Math.pow(v1y, 2) - 4*r1*r2*v1y*v2y + 2*r1*r2*Math.pow(v2x, 2) + 2*r1*r2*Math.pow(v2y, 2) + Math.pow(r2, 2)*Math.pow(v1x, 2) - 2*Math.pow(r2, 2)*v1x*v2x + Math.pow(r2, 2)*Math.pow(v1y, 2) - 2*Math.pow(r2, 2)*v1y*v2y + Math.pow(r2, 2)*Math.pow(v2x, 2) + Math.pow(r2, 2)*Math.pow(v2y, 2)))/(Math.pow(v1x, 2) - 2*v1x*v2x + Math.pow(v1y, 2) - 2*v1y*v2y + Math.pow(v2x, 2) + Math.pow(v2y, 2))

  collide = (circle, other) ->
    un = circle.point.to(other.point).normalize()
    ut = un.perpendicular()
    v1n = un.dot(circle.vector)
    v2n = un.dot(other.vector)
    v1t = ut.dot(circle.vector)
    v2t = ut.dot(other.vector)
    offset = un.scale((circle.radius + other.radius) - circle.distance(other)+1)
    m1 = circle.mass()
    m2 = other.mass()
    circle.point = circle.point.add(offset.reverse().scale(m2/(m1+m2)))
    other.point = other.point.add(offset.scale(m1/(m1+m2)))
    v1nprime = un.scale((v1n * (m1-m2) + 2*m2*v2n) / (m1+m2))
    v2nprime = un.scale((v2n * (m2-m1) + 2*m1*v1n) / (m1+m2))
    circle.vector = v1nprime.add(ut.scale(v1t))
    other.vector = v2nprime.add(ut.scale(v2t))
    rotationChange = Math.random() * (circle.mass() + other.mass()) - (circle.mass() + other.mass()) / 2
    circle.drotation += rotationChange / circle.mass()
    other.drotation -= rotationChange / other.mass()


  createjs.Ticker.framerate = 60
  createjs.Ticker.addEventListener 'tick', frame = (event={delta: 1000}) ->

    temp = circles[..]

    for circle in circles
      circle.move(event.delta/1000)

    for circle in circles
      if circle.point.x - circle.radius < 0
        circle.vector = circle.vector.scale(-1, 1)
        circle.point.x = circle.radius
      if circle.point.x + circle.radius > $(window).width()
        circle.vector = circle.vector.scale(-1, 1)
        circle.point.x = $(window).width() - circle.radius
      if circle.point.y - circle.radius < 0
        circle.vector = circle.vector.scale(1, -1)
        circle.point.y = circle.radius
      if circle.point.y + circle.radius > $(window).height()
        circle.vector = circle.vector.scale(1, -1)
        circle.point.y = $(window).height() - circle.radius
    for circle in circles
      for other in circles
        if circle.intersect(other)
          collide(circle, other)

    circles = temp
    stage.update()

  $(window).bind('resize', ->
    $('#flowcanvas').attr('width', $(window).width().toString())
    $('#flowcanvas').attr('height', $(window).height().toString())
    stage.update()
  )
, this)
