import { PropsWithChildren } from "react";

type WrapperProps = PropsWithChildren<{
    title: string;
}>;

export function Wrapper(props: WrapperProps) {
    return <div className="card max-w-screen-xl w-full bg-base-100 shadow-xl px-5 py-10">
        <h3 className="text-5xl">{props.title}</h3>
        <div className="py-10">{props.children}</div>
    </div>;
}