import * as React from 'react';
import Button from "react-bootstrap/Button";
import "../styles/time-input.scss";

type Props = {
    road_type?: number,
    level?: string,
    disabled?: boolean,
    handleRoadConditionLevel: ((a: string) => void)
}

type State = {
    less_value: string,
    greater_value: string
}

class RoadConditionButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = this.parseLevel();
        this.handleRoadConditionLevel = this.handleRoadConditionLevel.bind(this);
    }

    parseLevel() {
        let state = {
            less_value: '',
            greater_value: ''
        }

        if (!this.props.level) {
            return state;
        }

        const parts = this.props.level.split("|");
        if (parts.length < 3) {
            return state;
        }

        if (parts[1] === "<") {
            state.less_value = parts[2];
            return state;
        } else if (parts[1] === ">") {
            state.greater_value = parts[2];
            return state;
        } else if (parts.length > 3 && (parts[1] === "<<" || parts[1] === "><")) {
            state.less_value = parts[2];
            state.greater_value = parts[3];
            return state;
        } else {
            return state;
        }
    }

    formatLevel() {
        const map = {
            10: 's',
            11: 'i',
            12: 'v'
        }
        const less = this.state.less_value;
        const gret = this.state.greater_value;

        let newLevel = `${map[this.props.road_type]} | `;
        if (gret.length === 0) {
            newLevel += `< | ${less}`;
        } else if (less.length === 0) {
            newLevel += `> | ${gret}`;
        } else if (Number(less) < Number(gret)) {
            newLevel += `<< | ${less} | ${gret}`;
        } else {
            newLevel += `>< | ${less} | ${gret}`
        }

        return newLevel;
    }

    handleRoadConditionLevel() {
        this.props.handleRoadConditionLevel(this.formatLevel());
    }

    handleLessThan(value: string) {
        this.setState({
            less_value: value
        });
        this.handleRoadConditionLevel();
    }

    handleGreaterThan(value: string) {
        this.setState({
            greater_value: value
        });
        this.handleRoadConditionLevel();
    }

    render() {
        return (
            <div className="time-input">
                <div>
                    <span>Less than</span>
                    <input type="number" value={this.state.less_value} disabled={this.props.disabled} onChange={(e) => this.handleLessThan(e.target.value)} />
                </div>
                <div>
                    <span>Greater than</span>
                    <input type="number" pattern="[0-9]*" value={this.state.greater_value} disabled={this.props.disabled} onChange={(e) => this.handleGreaterThan(e.target.value)} />
                </div>
            </div>
        );
    }
}

export default RoadConditionButton;
