
import { _decorator, Component, Node, Prefab, UITransform, CCFloat, ScrollView, Camera, Vec3, tween, instantiate, randomRangeInt } from 'cc';
import { Bridge } from './Bridge';
import { Planet } from './Planet';
const { ccclass, property } = _decorator;
 
@ccclass('LevelMap')
export class LevelMap extends Component {

    @property({type: Prefab}) planetPrefab: Prefab
    @property({type: UITransform}) container: UITransform
    @property({type: CCFloat}) distance: number

    // @property({type: Prefab}) backStone: Prefab
    // @property({type: Node}) backContainer: Node

    // @property({type: Prefab}) frontStone: Prefab
    // @property({type: Node}) frontContainer: Node

    @property({type: ScrollView}) scroll: ScrollView
    @property({type: Node}) view: Node

    @property({type: Camera}) camera: Camera
    @property({type: Node}) background: Node
    public static Instance: LevelMap;
    start(){
        LevelMap.Instance = this
        Bridge.Instance.mapLoaded()
    }
    scrollCallback(){
        let viewpos = new Vec3(this.view.position)
        // this.backContainer.position = viewpos.multiplyScalar(0.5)
        // this.frontContainer.position = viewpos.multiplyScalar(4)
    }
    update(){
        this.scrollCallback()
        let bgPos: Vec3 = new Vec3(this.camera.node.position)
        bgPos.y = 0
        bgPos.z = 0
        this.background.position = bgPos
    }
    init(count: number, lastLevel: number = 0, levelsUnlocked: number, unlockNew: boolean){
        this.scroll.enabled = false
        // for(let i = 0; i < count/3; i++){
        //     let bstone: Node = instantiate(this.backStone)
        //     bstone.parent = this.backContainer
        //     bstone.position = new Vec3(i*1300, -150,0)
        // }
        // for(let i = 0; i < count; i++){
        //     let fstone: Node = instantiate(this.frontStone)
        //     fstone.parent = this.frontContainer
        //     fstone.position = new Vec3(i*1000, -200,0)
        //     let r = randomRangeInt(0,3)
        //     let st: string
        //     switch(r){
        //         case(0):{
        //             st = "StonesBig_Idle_1"
        //             break
        //         }
        //         case(1):{
        //             st = "StonesBig_Idle_2"
        //             break
        //         }
        //         case(2):{
        //             st = "StonesBig_Idle_3"
        //             break
        //         }
        //     }
        // }
        this.container.width = (count + 1) * this.distance
        let m = 1
        for(let i = 0; i < count; i++){
            let planet: Node = instantiate(this.planetPrefab)
            planet.parent = this.container.node
            planet.position = new Vec3((i + 1) * this.distance)
            planet.position.add(new Vec3(0, (m * 50) + 30))
            console.log("oke");
            let state: number
            if(i == levelsUnlocked)
                state = 0
            else if(i < levelsUnlocked)
                state = 1
            else
                state = 2
            m *= -1
            planet.getComponent(Planet).init(i,state)
        }
        this.container.node.position = new Vec3(-lastLevel * this.distance)
        this.scrollCallback()
        if(levelsUnlocked != (lastLevel + 1) || !unlockNew){
            console.log(levelsUnlocked + " " +lastLevel)
            this.scroll.enabled = true
            return
        }
        tween(this.container.node)
        .by(1, {position: new Vec3(Vec3.RIGHT).multiplyScalar(-this.distance/1.2)})
        .call(() => {this.scroll.enabled = true})
        .start()
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

}

