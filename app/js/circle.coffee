class Circle

  constructor: (@stage, @point=new Point(0,0), @vector=new Vector(0,0), @radius=0, @color, @image) ->
    @nugget = new createjs.Bitmap(@image)
    @circle = new createjs.Shape()
    @colorCommand = @circle.graphics.beginFill(@color).command
    @circle.graphics.drawCircle(0, 0, @radius)
    @visible = false
    @drotation = Math.random() * 10 - 5

  move: (t=1) ->
    @point = @point.add(@vector.scale(t))
    @circle.x = @point.x
    @circle.y = @point.y
    @nugget.x = @point.x #- @scale / 2 * @nugget.image.naturalWidth
    @nugget.y = @point.y #- @scale / 2 * @nugget.image.naturalHeight
    @nugget.rotation += @drotation

  draw: ->
    @nugget.regX = @nugget.image.naturalWidth / 2
    @nugget.regY = @nugget.image.naturalHeight / 2
    @scale = @radius / Math.sqrt(@nugget.image.naturalWidth * @nugget.image.naturalHeight) * 2
    @nugget.scaleX = @scale
    @nugget.scaleY = @scale
    #@stage.addChild(@circle)
    @stage.addChild(@nugget)
    @move(0)
    @visible = true

  remove: ->
    @stage.removeChild(@circle)
    @stage.removeChild(@nugget)
    @visible = false

  setColor: (color)->
    @color = color
    @colorCommand.style = color

  mass: ->
    @radius * @radius

  distance: (circle) ->
    Math.sqrt(Math.pow(circle.point.x - @point.x, 2) + Math.pow(circle.point.y - @point.y, 2))

  intersect: (circle) ->
    Math.pow(circle.point.x - @point.x, 2) + Math.pow(circle.point.y - @point.y, 2) < Math.pow(circle.radius + @radius, 2) and circle != this
