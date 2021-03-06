
import { _decorator, Component, CCInteger, UITransform, Prefab, director, instantiate, Vec3, Node, RichText, JsonAsset, js, random, randomRange, Color, Vec2, CCFloat, ParticleSystem2D, Quat, Graphics, Sprite, color, randomRangeInt, find } from 'cc';

import { Line } from './Line';
import { Slot } from './Slot';
import { FireflyController } from './FireflyController';
import { WinChecker } from './WinChecker';
import { Firefly } from './Firefly';
import { GameStateMachine } from './../GameStateMachine';
import { SoundManager } from '../SoundManager';
import { Bridge } from '../Bridge';
const { ccclass, property } = _decorator;

@ccclass('GridGenerator')
export class GridGenerator extends Component {
    config: string = null!
    
    @property({type: UITransform}) container: UITransform = null!
    @property({type: UITransform}) lineContainer: UITransform = null!
    @property({type: UITransform}) slotContainer: UITransform = null!
    @property({type: FireflyController}) controller: FireflyController
    @property({type: Prefab}) fireflyPrefab: Prefab
    @property({type: Prefab}) slotPrefab: Prefab
    @property({type: Prefab}) doubleSlotPrefab: Prefab
    @property({type: Prefab}) linePrefab:Prefab
    @property({type: Prefab}) cornerPoint: Prefab
    @property({type: CCFloat}) lineWidth: number
    @property({type: [Node]}) roamPoints: Array<Node> = []
    @property({type: [Node]}) spawnPos: Array<Node> = []
    @property({type: CCInteger}) fliesAtOnes: number
    
    private configs: Array<JsonAsset> = []
    private scale: number
    private gridSlots: Array<Vec3>
    private fireflyInfo: FireflyInformation = null
    private slots: Array<Slot>
    private slotPositions: Array<Vec3> = []
    private lines: Array<Line>
    private levelInfo: LevelInformation

    private paramCount: number = 1
    private count: number;

    init(conf: string, count?){
        if(Bridge.Instance.levelCount == 0)
            SoundManager.Instance.playConstructorTutorial()
        else
            SoundManager.Instance.playConstructorStartPhase1()
        this.count = count;
        this.config = conf
        this.scale = this.container.height / 100
        this.CreateGrid(this.container)
    }

    private CreateGrid(zone?: UITransform){
        let readResult: Array<any> = this.ReadConfig()
        this.ReadLevelInfo(readResult)
        this.ReadSlots(readResult)
        this.ReadLines(readResult)
        this.SpawnFireflyes()
    }
    private ReadConfig(){
        let readObjects: Array<any> = []
        return readObjects = JSON.parse(this.config).json 
    }
    private ReadLevelInfo(readObjects: Array<any>){
        this.levelInfo = readObjects[0]
        console.log(readObjects);
        let colors: Array<Color> = []
        let colorString = ""
        for(let c = 0; c < this.levelInfo.availablecolors.length; c++){
            let ch = this.levelInfo.availablecolors[c]
            if(ch == ","){
                if(colorString == "none"){
                    break
                }
                colors[colors.length] = this.ReadColor(colorString)
                colorString = ""
                continue
            }
            colorString += ch
        }
        if(colorString == "none"){
        }
        colors[colors.length] = this.ReadColor(colorString)
    }
    unLitSlots: number = 0
    private ReadSlots(readObjects: Array<any>){
        this.slots = new Array<Slot>()
        let slotCount:number = 0
        for(let i = this.paramCount; i < this.levelInfo.slotcount + this.paramCount; i++){
            let readString: ReadSlot
            readString = readObjects[i]

            let c = 0
            //Index
            let id: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                id+= readString.slot[c]
            }
            c++
            //Type
            let type: number = Number(readString.slot[c])
            c+=2
            //Color
            let colorString: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                colorString+= readString.slot[c]
            }
            c++
            let color:Color = new Color(255,255,255,255)
            color = this.ReadColor(colorString)
            
            //isLit
            let isLit: boolean = false
            switch(readString.slot[c]){
                case "0": {
                    isLit = false
                    break
                }
                case "1":{
                    isLit = true
                    break
                }
            }
            c+= 2
            //XPosition
            let x: number
            let xString: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                xString += readString.slot[c]
            }
            
            c++
            x = Number(xString)
            //YPosition
            let y: number
            let yString: string = ""
            for(;c < readString.slot.length; c++){
                if(readString.slot[c] == ",")
                    break
                yString += readString.slot[c]
            }
            c++
            y = Number(yString)

            let slotNode: Node
            let slot
            if(type == 0){
                slotNode = instantiate(this.slotPrefab)
                slotNode.parent = this.slotContainer.node
                slot = slotNode.getComponent(Slot)
                slot.Initialize(id,color, isLit, x * this.scale - this.container.width/2, y * this.scale - this.container.height/2)
                this.slotPositions.push(slot.position)
                if(!isLit)
                    this.unLitSlots++
            }
            if(type == 1){
                slotNode = instantiate(this.doubleSlotPrefab)
                slotNode.parent = this.slotContainer.node
                slot.Initialize(id,color, isLit, x * this.scale - this.container.width/2, y * this.scale - this.container.height/2)
                
                this.slotPositions.push(slot.position.add(new Vec3(slot.slotDistance)))
                this.slotPositions.push(slot.position.add(new Vec3(-slot.slotDistance)))
                if(!isLit)
                    this.unLitSlots+=2
            }
            
            this.slots[slotCount] = slot
            slotCount++
            
        }
        this.controller.init(this.slots, this.roamPoints)
        WinChecker.Instance.Initialize(this.unLitSlots, this.count)
    }

    private ReadLines(readObjects: Array<any>){
        this.lines = new Array<Line>()
        let lineCount = 0
        for(let i = this.levelInfo.slotcount + this.paramCount; i < readObjects.length; i++){
            let readString: ReadLine = readObjects[i]
            let c = 0
            //x1
            let x1: number
            let x1String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                x1String += readString.line[c]
            }
            c++
            x1 = Number(x1String)
            
            //y1
            let y1: number
            let y1String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                y1String += readString.line[c]
            }
            c++
            y1 = Number(y1String)

            //x2
            let x2: number
            let x2String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                x2String += readString.line[c]
            }
            c++
            x2 = Number(x2String)

            //y2
            let y2: number
            let y2String: string = ""
            for(; c < readString.line.length; c++){
                if(readString.line[c] == ",")
                    break
                y2String += readString.line[c]
            }
            c++
            y2 = Number(y2String)
            let slotID: string = ""
            for(; c < readString.line.length; c++){
                slotID += readString.line[c]
            }
            let color: Color
            let slot: Slot
            this.slots.forEach(sl => {
                if(sl.GetID() == slotID){
                    color = sl.color
                    slot = sl
                }
            });
            let lineNode = instantiate(this.linePrefab)
            lineNode.parent = this.lineContainer.node
            let line: Line = lineNode.getComponent(Line)
            line.Initialize(x1 * this.scale - this.container.width / 2, x2 * this.scale - this.container.width/2
                , y1 * this.scale - this.container.height / 2, y2 * this.scale - this.container.height/2, color, this.lineWidth)
            this.lines[lineCount] = line
            slot.AddLine(line)
            lineCount++
        }
    }
    insideWhenSpawned: number = 0
    ar: Array<Firefly> = []
    colorAr: Array<string> = []
    private SpawnFireflyes(){
        let st: string = this.levelInfo.fireflycolors
        let colorString: string = ""
        
        for(let c = 0; c < st.length; c++){
            if(st[c] == ","){
                // ar.push(this.Spawn(colorString, this.controller.node))
                this.colorAr.push(colorString)
                colorString = ""
                continue
            }
            colorString += st[c]
        }
        this.colorAr.push(colorString)
        for(let i = 0; i < this.colorAr.length; i++){
            this.ar.push(this.Spawn(this.colorAr[i], this.controller.node))
        }
        this.controller.spawnEnded(this.ar, this.count - this.fliesAtOnes)
    }
    public NextSpawn(nextCount: number){
        SoundManager.Instance.playConstructorStartPhase2()
        console.log("Next " + nextCount);
        if(this.count < this.fliesAtOnes)
            this.controller.NextMoveIn(nextCount)
        else
            this.controller.NextMoveIn(this.fliesAtOnes)
    }
    s: number = 0
    smallCount = 0
    private Spawn(colorString: string, parent: Node): Firefly{
        let fly: Firefly = instantiate(this.fireflyPrefab).getComponent(Firefly)
        console.log("oke0");
        console.log(fly.node)
        let smalls = this.fliesAtOnes/2
        console.log(this.controller.node + " " + fly.node);
        console.log("oke1");
        fly.node.setParent(parent)
        fly.node.position = this.spawnPos[this.s].position
        console.log("oke2");
        this.s++
        if(this.s == this.spawnPos.length)
            this.s = 0
        let check = this.fliesAtOnes
        if(this.fliesAtOnes > this.count)
            check = this.count
        if(this.insideWhenSpawned < check){
            this.insideWhenSpawned++
            fly.Initialize(false, this.ReadColor(colorString), true, (this.smallCount < smalls))
            this.smallCount++
            return fly
        }
        fly.Initialize(false, this.ReadColor(colorString), false, (this.smallCount < smalls))
        console.log("Minus " + this.count +  " " + this.fliesAtOnes + " " + (this.count - this.fliesAtOnes));
        
        let m: number = this.count - this.fliesAtOnes
        if(m < 0)
            m = 0
        this.controller.addOutsideArray(fly, m)
        this.insideWhenSpawned++
        this.smallCount++
        return fly
    }
    private ReadColor(colorString: string): Color{
        switch(colorString){
            case("green"):{
                return(new Color(0,255,0,255))
            }
            case("red"):{
                return(new Color(255,0,0,255))
            }
            case("yellow"):{
                return(new Color(255,255,0,255))
            }
            case("blue"):{
                return(new Color(0,125,255,255))
            }
            case("orange"):{
                return(new Color(255,165,0,255))
            }
            case("violet"):{
                return(new Color(255,0,255,255))
            }
            case("gray"):{
                return(new Color(200,200,200,255))
            }
        }
        return Color.BLACK
    }
}
interface ReadSlot{
    slot: string
}
interface ReadLine{
    line: string
}
interface LevelInformation{
    availablecolors: string
    levelnum: number
    fireflycolors: string
    slotcount: number
}
interface FireflyInformation{
    fireflyMinSpeed: number
    fireflyMaxSpeed: number
    fireflyMinSize: number
    fireflyMaxSize: number
}

