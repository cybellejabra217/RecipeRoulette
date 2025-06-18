import React, { useEffect, useState } from "react";

/**
 * A React component that displays the current date and time.
 * The time format can be either military (24-hour format) or standard (12-hour format with AM/PM).
 * 
 * @param {boolean} isMilitary - A flag indicating whether to display the time in military (24-hour) format.
 * If `true`, the time is displayed in 24-hour format; if `false`, it is displayed in 12-hour format with AM/PM.
 * @returns {JSX.Element} - A React element displaying the current date and time in the specified format.
 */
const DateTimeLabel = (isMilitary) => {

    const [time, setTime] = useState(new Date());

    useEffect(()=>{
        upateDateTime();
    }, []);

    const upateDateTime = () =>{
        const interval = setInterval(()=>{
            setTime(new Date());
        }, 1000);
    }

    const formatTime = () =>{
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();

        const ampOrPm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours || 12;
        
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        const formattedTime = `${hours}:${minutes}:${seconds} ${ampOrPm}`;
        return formattedTime;
    }

    const formatTimeMilitary = () =>{
        const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        return formattedTime;
    }

    const formatDate = () => {
        return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    }

    return(
        <React.Fragment>
            {formatDate()} on {isMilitary ? formatTimeMilitary() : formatTime()}
        </React.Fragment>
    )
};

export default DateTimeLabel;