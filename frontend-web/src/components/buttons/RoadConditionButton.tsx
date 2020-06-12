import * as React from 'react';
import { useState } from 'react';
import Button from "react-bootstrap/Button";
import "../styles/time-input.scss";

type Props = {
    road_type?: number,
    level?: string,
    disabled?: boolean,
    handleRoadConditionLevel: ((a: string) => void)
}

export default function RoadConditionButton(props: Props) {
    const [lessValue, setLessValue] = useState("");
    const [greaterValue, setGreaterValue] = useState("");

    if (props.level) {
        const parts = props.level.split("|");
        if (parts.length > 2) {
            if (parts[1] === "<") {
                setLessValue(parts[2]);
            } else if (parts[1] === ">") {
                setGreaterValue(parts[2]);
            } else if (parts.length > 3 && (parts[1] === "<<" || parts[1] === "><")) {
                setLessValue(parts[2]);
                setGreaterValue(parts[3]);
            }
        }
    }

    function formatLevel() {
        const map = {
            10: 's',
            11: 'i',
            12: 'v'
        }

        let newLevel = `${map[props.road_type]} | `;
        if (greaterValue.length === 0) {
            newLevel += `< | ${lessValue}`;
        } else if (lessValue.length === 0) {
            newLevel += `> | ${greaterValue}`;
        } else if (Number(lessValue) < Number(greaterValue)) {
            newLevel += `<< | ${lessValue} | ${greaterValue}`;
        } else {
            newLevel += `>< | ${lessValue} | ${greaterValue}`
        }

        return newLevel;
    }

    function handleRoadConditionLevel() {
        props.handleRoadConditionLevel(formatLevel());
    }

    function handleLessThan(value: string) {
        setLessValue(value);
        handleRoadConditionLevel();
    }

    function handleGreaterThan(value: string) {
        setGreaterValue(value);
        handleRoadConditionLevel();
    }

    return (
        <div className="time-input">
            <div>
                <span>Less than</span>
                <input type="number" value={lessValue} disabled={props.disabled} onChange={(e) => handleLessThan(e.target.value)} />
            </div>
            <div>
                <span>Greater than</span>
                <input type="number" pattern="[0-9]*" value={greaterValue} disabled={props.disabled} onChange={(e) => handleGreaterThan(e.target.value)} />
            </div>
        </div>
    );
}
