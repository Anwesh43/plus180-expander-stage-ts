const w : number = window.innerWidth, h : number = window.innerHeight
const scDiv : number = 0.51
const scGap : number = 0.05
const strokeFactor : number = 90
const sizeFactor : number = 3
const color : string = "#4527A0"
const lines : number = 4
const nodes : number = 5

const maxScale : Function = (scale : number, i : number, n : number) : number => Math.max(0, scale - i / n)

const divideScale : Function = (scale : number, i : number, n : number) : number => Math.min(1/n, maxScale(scale, i, n))

const scaleFactor : Function = (scale : number) : number => Math.floor(this / scDiv)

const mirrorValue : Function = (scale : number, a : number, b : number) : number => {
    const k : number = scaleFactor(scale)
    return (1 - k)/a + k / b
}

const updateScale : Function = (scale : number, dir : number, a : number, b : number) : number => {
    return mirrorValue(scale, a, b) * scGap * dir
}

const drawPE180Node : Function = (context : CanvasRenderingContext2D, i : number, scale : number) => {
    const gap : number = w / (nodes + 1)
    const size : number = gap / sizeFactor
    context.strokeStyle = color
    context.lineCap = 'round'
    context.lineWidth = Math.min(w, h) / strokeFactor
    const sc1 : number = divideScale(scale, 0, 2)
    const sc2 : number = divideScale(scale, 1, 2)
    context.save()
    context.translate(gap * (i + 1), h / 2)
    for (var j = 0; j < lines; j++) {
        const scj : number = divideScale(sc1, j, lines)
        const sck : number = divideScale(sc2, j, lines)
        context.save()
        context.rotate(Math.PI / 2 * j)
        context.translate(size / 2, 0)
        for (var k = 0; k < 2; k++) {
            context.save()
            context.rotate(Math.PI * j * sck)
            context.beginPath()
            context.moveTo(-size/2 * (1 - scj), 0)
            context.lineTo(-size/2, 0)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    context.restore()
}

class Plus180ExpanderStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage = new Plus180ExpanderStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0
    update(cb : Function) {
        this.scale += updateScale(this.scale, lines, lines)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
        }
    }

    startUpdating(cb : Function) {
        if (this.dir ==  0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class PE180Node {
    next : PE180Node
    prev : PE180Node
    state : State = new State()
    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new PE180Node(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        drawPE180Node(context, this.i, this.state.scale)
        if (this.next) {
            this.next.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : PE180Node {
        var curr : PE180Node = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}
