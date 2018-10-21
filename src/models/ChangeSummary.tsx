import { ChangeType } from './ChangeType';

export class ChangeSummary {
    constructor(type: string, changeType: ChangeType) {
        this.type = type;
        this.changeType = changeType;
    }

    type: string;
    changeType: ChangeType;
    count: number;
}
