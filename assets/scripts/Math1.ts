
import { _decorator, Component, Node, CCFloat, CCInteger, Prefab, random, randomRangeInt, instantiate, Vec3, Label, color, Color, tween, Skeleton, sp, UIOpacity } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Tileset } from './Tileset';
import { Frame } from './Frame';
import { setMixedSkin } from './Helper';
const { ccclass, property } = _decorator;

@ccclass('Math1')
export class Math1 extends Component {
    @property({type: CCInteger}) tileNumber: number
    @property({type: Color}) disableColor: Color
    @property({type: Color}) activeColor: Color
    @property({type: [Prefab]}) tilePrefabs3: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs4: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs5: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs6: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs7: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs8: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs9: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs10: Array<Prefab> = []
    @property({type: [sp.Skeleton]}) numberSkeletons: Array<sp.Skeleton> = []
    @property({type: Node}) container: Node
    @property({type: UIOpacity}) blurKey: UIOpacity

    public init(count: number, rev: string){
        let tileNumber: number = count
        let reversed: boolean
        if(rev == "no")
            reversed = false
        else
            reversed = true
        if(reversed){
            for(let i = 0; i < count ; i++){
                let st = "number-" + (count - i).toString() + "-off"
                setMixedSkin(this.numberSkeletons[i], "numMix", ["Slot-numbers", st])
            }
        }
        else{
            for(let i = 0; i < count ; i++){
                let st = "number-" + (i+1).toString()
                this.numberSkeletons[i].node.name = st;
                setMixedSkin(this.numberSkeletons[i], "numMix", ["Slot-numbers", st + "-off"])

            }
        }
        let prefab: Prefab
        switch(tileNumber){
            case(3):{
                let r = randomRangeInt(0, this.tilePrefabs3.length)
                prefab = this.tilePrefabs3[r]
                break
            }
            case(4):{
                let r = randomRangeInt(0, this.tilePrefabs4.length)
                prefab = this.tilePrefabs4[r]
                break
            }
            case(5):{
                let r = randomRangeInt(0, this.tilePrefabs5.length)
                prefab = this.tilePrefabs5[r]
                break
            }
            case(6):{
                let r = randomRangeInt(0, this.tilePrefabs6.length)
                prefab = this.tilePrefabs6[r]
                break
            }
            case(7):{
                let r = randomRangeInt(0, this.tilePrefabs7.length)
                prefab = this.tilePrefabs7[r]
                break
            }
            case(8):{
                let r = randomRangeInt(0, this.tilePrefabs8.length)
                prefab = this.tilePrefabs8[r]
                break
            }
            case(9):{
                let r = randomRangeInt(0, this.tilePrefabs9.length)
                prefab = this.tilePrefabs9[r]
                break
            }
            case(10):{
                let r = randomRangeInt(0, this.tilePrefabs10.length)
                prefab = this.tilePrefabs10[r]
                break
            }
        }
        let tile: Node = instantiate(prefab)
        tile.setParent(this.container)
        tile.setPosition(new Vec3(0,0,0))
        tile.setScale(new Vec3(1,1,1))
        tile.getComponent(Tileset).init(this, reversed)   
    }
    private currentTile = 0
    public setTile(count: number){
        setMixedSkin(this.numberSkeletons[this.currentTile], "numMix", ["Slot-numbers", this.numberSkeletons[this.currentTile].node.name])
        this.currentTile++
    }
    setWin(){
        tween(this.blurKey)
        .to(0.5, {opacity: 0})
        .start()
        tween(this.node)
        .delay(2)
        .call(() =>{
            Frame.Instance.zebraWin()
            GameStateMachine.Instance.colorLamp()
            GameStateMachine.Instance.winState()
        })
        .start()
    }
}

