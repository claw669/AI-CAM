namespace AiCam {

    /**
     * AI识别模式
     */
    export enum Mode {
        //% block="Face"
        Face = 0,
        //% block="Color"
        Color = 1,
        //% block="QR"
        QR = 2,
        //% block="Card"
        Card = 3
    }

    // =========================
    // 数据缓存
    // =========================

    let faceXValue = 0
    let faceYValue = 0
    let faceValid = false

    let colorValue = ""
    let qrValue = ""
    let cardValue = ""

    // =========================
    // 数据解析
    // =========================
    function parseLine(line: string): void {
        line = line.trim()

        if (line.length == 0) {
            return
        }

        let parts = line.split(":")
        if (parts.length < 3) {
            return
        }

        let mode = parts[1]
        let data = parts[2]

        if (mode == "FACE") {
            let xy = data.split(",")
            if (xy.length >= 2) {
                let x = parseInt(xy[0])
                let y = parseInt(xy[1])
                if (!isNaN(x) && !isNaN(y)) {
                    faceXValue = x
                    faceYValue = y
                    faceValid = true
                }
            }
        } else if (mode == "COLOR") {
            colorValue = data
            faceValid = false 
        } else if (mode == "QR") {
            qrValue = data
            faceValid = false 
        } else if (mode == "CARD") {
            cardValue = data
            faceValid = false 
        }
    }

    // =========================
    // 初始化
    // =========================

    /**
     * Initialize AI Camera
     */
    //% block="Initialize AI Camera TX %tx RX %rx Baudrate %baud"
    //% tx.defl=SerialPin.P2
    //% rx.defl=SerialPin.P8
    //% baud.defl=9600
    //% group="Base"
    //% weight=100
    export function begin(
        tx: SerialPin,
        rx: SerialPin,
        baud: number
    ): void {
        serial.redirect(tx, rx, baud)
        basic.pause(600) 
        serial.readString() 

        control.inBackground(function () {
            while (true) {
                let strVal = serial.readUntil(serial.delimiters(Delimiters.NewLine))
                if (strVal && strVal.length > 0) {
                    parseLine(strVal)
                }
                basic.pause(5)
            }
        })
    }

    // =========================
    // 模式切换
    // =========================

    /**
     * Set AI Mode
     */
    //% block="Set AI Mode %mode"
    //% group="Base"
    //% weight=90
    export function setMode(mode: Mode): void {
        let i = 0
        faceValid = false 

        switch (mode) {
            case Mode.Face:
                for (; i < 3; i++) {
                    serial.writeLine("MODE:FACE")
                    basic.pause(50)
                }
                break
            case Mode.Color:
                for (; i < 3; i++) {
                    serial.writeLine("MODE:COLOR")
                    basic.pause(50)
                }
                break
            case Mode.QR:
                for (; i < 3; i++) {
                    serial.writeLine("MODE:QR")
                    basic.pause(50)
                }
                break
            case Mode.Card:
                for (; i < 3; i++) {
                    serial.writeLine("MODE:CARD")
                    basic.pause(50)
                }
                break
        }
    }

    // =========================
    // 人脸识别
    // =========================

    /**
     * Face Detected
     */
    //% block="Face Detected"
    //% group="Face"
    //% weight=80
    export function faceDetected(): boolean {
        return faceValid
    }

    /**
     * Face X Coordinate
     */
    //% block="Face X Coordinate"
    //% group="Face"
    //% weight=70
    export function faceX(): number {
        return faceXValue
    }

    /**
     * Face Y Coordinate
     */
    //% block="Face Y Coordinate"
    //% group="Face"
    //% weight=60
    export function faceY(): number {
        return faceYValue
    }

    // =========================
    // 颜色识别
    // =========================

    /**
     * Color Result
     */
    //% block="Color Result"
    //% group="Color"
    //% weight=50
    export function color(): string {
        return colorValue
    }

    // =========================
    // 二维码识别
    // =========================

    /**
     * QR Code Content
     */
    //% block="QR Code Content"
    //% group="QR"
    //% weight=40
    export function qr(): string {
        return qrValue
    }

    // =========================
    // 卡片识别
    // =========================

    /**
     * Card Content
     */
    //% block="Card Content"
    //% group="Card"
    //% weight=30
    export function card(): string {
        return cardValue
    }
}