
import { _decorator, Component, Node, Prefab, UITransform, CCFloat, ScrollView, Camera, Vec3, tween, instantiate, randomRangeInt, AudioSource, SpriteFrame } from 'cc';
import { Bridge } from './Bridge';
import { Planet } from './Planet';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;
 
@ccclass('LevelMap')
export class LevelMap extends Component {

    @property({type: AudioSource}) unlockTap: AudioSource
    @property({type: AudioSource}) lockedTap: AudioSource

    @property({type: Prefab}) planetPrefab: Prefab
    @property({type: [SpriteFrame]}) pictograms: Array<SpriteFrame> = []

    @property({type: UITransform}) container: UITransform
    @property({type: CCFloat}) distance: number

    @property({type: [Prefab]}) backPref: Array<Prefab> = []
    @property({type: Node}) backContainer: Node

    @property({type: [Prefab]}) middlePref: Array<Prefab> = []
    @property({type: Node}) middleContainer: Node

    @property({type: [Prefab]}) frontPref: Array<Prefab> = []
    @property({type: Node}) frontContainer: Node

    @property({type: ScrollView}) scroll: ScrollView
    @property({type: Node}) view: Node

    @property({type: Camera}) camera: Camera
    @property({type: Node}) background: Node


    public static Instance: LevelMap;
    start(){
        LevelMap.Instance = this
        if(!window.Unity)
            Bridge.Instance.mapLoaded()
    }
    scrollCallback(){
        let viewpos = new Vec3(this.view.position)
        this.backContainer.position = viewpos.multiplyScalar(0.2)
        this.middleContainer.position = viewpos.multiplyScalar(0.4)
        this.frontContainer.position = viewpos.multiplyScalar(4)
    }
    update(){
        this.scrollCallback()
        let bgPos: Vec3 = new Vec3(this.camera.node.position)
        bgPos.y = 0
        bgPos.z = 0
        this.background.position = bgPos
    }
    init(count: number, lastLevel: number = 0, levelsUnlocked: number, unlockNew: boolean, planets: Array<string>, planetNumbers: Array<number>){
        this.scroll.enabled = false

        for(let i = 0; i < count/3; i++){
            let r = randomRangeInt(0, this.backPref.length)
            let bstone: Node = instantiate(this.backPref[r])
            bstone.parent = this.backContainer
            bstone.position = new Vec3(i*1300, -150,0)
        }

        for(let i = 0; i < count/3; i++){
            let r = randomRangeInt(0, this.middlePref.length)
            let bstone: Node = instantiate(this.middlePref[r])
            bstone.parent = this.middleContainer
            bstone.position = new Vec3(i*1300, -150,0)
        }

        // for(let i = 0; i < count; i++){
        //     let fstone: Node = instantiate(this.frontPref)
        //     fstone.parent = this.frontContainer
        //     fstone.position = new Vec3(i*1000, -200,0)
        // }

        this.container.width = (count + 1) * this.distance
        let m = 1
        for(let i = 0; i < count; i++){
            let planet: Node = instantiate(this.planetPrefab)
            planet.parent = this.container.node
            planet.position = new Vec3((i + 1) * this.distance)
            planet.position.add(new Vec3(0, (m * 20)))
            console.log("oke");
            let state: number
            if(i == levelsUnlocked)
                state = 0
            else if(i < levelsUnlocked)
                state = 1
            else
                state = 2
            m *= -1
            planet.getComponent(Planet).init(i,state, planets[i], planetNumbers[i])
        }
        this.container.node.position = new Vec3(-(lastLevel + 1) * this.distance)
        this.scroll.enabled = true
        if(unlockNew)
            this.container.node.position = new Vec3(-(lastLevel + 2) * this.distance)
        else
            this.container.node.position = new Vec3(-(lastLevel + 1) * this.distance)
        this.scrollCallback()
        if(Bridge.Instance.formCatalogue){
            console.log("first time");
            Bridge.Instance.formCatalogue = false
            if(Bridge.Instance.levelCount == 0)
                SoundManager.Instance.playFirstMeta()
            else
                SoundManager.Instance.playGameStart()
        }
        
    }

    public playUnlocked(){
        this.unlockTap.play()
    }
    public playLocked(){
        this.lockedTap.play()
    }

    focusOnIsland(pos: Vec3, id: number){
        tween(this.camera)
        .to(1, {orthoHeight: 150})
        .start()
        pos.z = 1000
        tween(this.camera.node)
        .to(1, {worldPosition: pos})
        .start()
    }

    public getPictogram(name: string): SpriteFrame{
        let frame: SpriteFrame = null
        this.pictograms.forEach(pic => {
            if(pic.name == name){
                frame = pic
            }            
        });
        return frame
    }
    public unlockOne(){
        Bridge.Instance.unlockOne()
    }
    public unlockAll(){
        Bridge.Instance.unlockAll()
    }
}

