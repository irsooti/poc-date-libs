import { PropsWithChildren } from "react";

export const Today = ({
    unix,
    today,
    time,
    children
}: PropsWithChildren<{
    unix: number;
    today: string;
    time: string;
}>) => {
    return <div>
        <p className="text-lg">{today}</p>
        <p>{time} - <i>unix: {unix}</i></p>

        <div className="py-5">
            {children}
        </div>
    </div>
}