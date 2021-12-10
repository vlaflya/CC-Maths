
import { _decorator, Component, Node, CCFloat, CCInteger, Prefab, random, randomRangeInt, instantiate, Vec3 } from 'cc';
import { Tileset } from './Tileset';
import { Math } from './Math';
const { ccclass, property } = _decorator;

@ccclass('Math1')
export class Math1 extends Math {
    @property({type: CCInteger}) tileNumber: number
    @property({type: [Prefab]}) tilePrefabs3: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs4: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs5: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs6: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs7: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs8: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs9: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs10: Array<Prefab> = []

    start () {
    }
    public init(json: string){
        let inf: information = JSON.parse(json)
        let tileNumber: number
        let reversed: boolean
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
        tile.setParent(this.node)
        tile.setPosition(new Vec3(0,0,0))
        tile.getComponent(Tileset).init(this, reversed)   
    }
    setWin(){
        console.log("Math1 Win")
    }
}
class information{
    tileNumber: number
    reverced: boolean
}

