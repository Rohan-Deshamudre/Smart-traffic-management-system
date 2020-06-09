import * as React from 'react';
import Button from "react-bootstrap/Button";
import "./styles/congestionLevelButton.scss"

type Props = {
    level?: string,
    disabled?: boolean,
    handleCongestionLevel: ((a: string) => void)
}

export default function CongestionLevelButton(props: Props) {
    function handleCongestionLevel(newLevel: string) {
        props.handleCongestionLevel(newLevel);
    }

    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((btnNum) =>
        <Button key={'button' + btnNum} disabled={props.disabled ? !(props.level === btnNum) : false} onClick={() => handleCongestionLevel(btnNum)} className={props.level === btnNum ? 'active' : ''}>{btnNum}</Button>
    );

    return (

        <div className="d-flex justify-content-center w-100">
            <div className="congestion-level-button">
                {buttons}
            </div>
        </div>
    );
}
