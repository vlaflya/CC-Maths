
import { _decorator, Component, Node, CCFloat, CCInteger, Prefab, random, randomRangeInt, instantiate, Vec3, Label, color, Color } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Tileset } from './Tileset';
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
    @property({type: [Label]}) labels: Array<Label> = []
    @property({type: Node}) container: Node

    public init(count: number, rev: string){
        let tileNumber: number = count
        let reversed: boolean
        if(rev == "no")
            reversed = false
        else
            reversed = true
        if(reversed){
            for(let i = 0; i < count ; i++){
                this.labels[i].color = this.disableColor
                this.labels[i].string = (count - i).toString()
            }
        }
        else{
            for(let i = 0; i < count ; i++){
                this.labels[i].color = this.disableColor
                this.labels[i].string = (i+1).toString()
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
        this.labels[this.currentTile].color = this.activeColor
        this.currentTile++
    }
    setWin(){
        GameStateMachine.Instance.colorLamp()
        GameStateMachine.Instance.winState()
    }
}

