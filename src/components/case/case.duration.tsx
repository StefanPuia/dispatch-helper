import React from "react";
import moment from "moment";

export interface CaseDurationProps {
    start: number;
}

export interface CaseDurationState {
    duration: string;
}

class CaseDuration extends React.Component<CaseDurationProps, CaseDurationState> {
    private interval: NodeJS.Timeout | undefined;
    constructor(props: CaseDurationProps) {
        super(props);
        this.state = { duration: "00:00:00" };
    }
    render() {
        return <div className="case-time">{this.state.duration}</div>;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ duration: this.calculateDuration() });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    private calculateDuration() {
        return moment.utc(moment().diff(moment.utc(this.props.start))).format("HH:mm:ss");
    }
}

export default CaseDuration;
