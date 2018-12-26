const w : number = window.innerWidth, h : number = window.innerHeight
const scDiv : number = 0.51
const scGap : number = 0.05
const strokeFactor : number = 90
const sizeFactor : number = 3
const color : string = "#4527A0"

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