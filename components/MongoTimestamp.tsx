import React from "react";
import Timestamp  from "react-timestamp"

interface MongoTimestampProps {
    datestring: string
}

export default function MongoTimestamp({ datestring }: MongoTimestampProps) {
    const date = new Date(datestring);
    return (
        <Timestamp date={date} />
    )
}