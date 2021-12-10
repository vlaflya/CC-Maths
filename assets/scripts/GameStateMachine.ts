
import { _decorator, Component, Node } from 'cc';
import { GeneralStateMachine } from './GeneralStateMachine';
const { ccclass, property } = _decorator;

@ccclass('GameStateMachine')
export class GameStateMachine extends Component {
    private stateMachine: GeneralStateMachine;
    start () {
        this.stateMachine = new GeneralStateMachine(this, "game")
        
    }
}
