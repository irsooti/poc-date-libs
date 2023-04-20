import { useState } from "react";
export type ErrorFields = {
    [key: number]: {
        [key: number]: boolean
    }
}

type RangeFormProps = {
    errorFields?: ErrorFields;
    onSubmit: ({ start, end }: {
        start: string;
        end: string;
        timeSlots: [string, string][];
        referringDate: string;
    }) => void;
};

export const useErrorFields = (err: ErrorFields = {}) => {
    return useState<ErrorFields>(err);

}

export const RangeForm = (props: RangeFormProps) => {
    const [timeSlots, setTimeSlots] = useState(0);

    return <form className="form" onSubmit={evt => {
        evt.preventDefault();
        const formData = new FormData(evt.target as HTMLFormElement);

        const start = formData.get('start');
        const end = formData.get('end');
        const times_start = formData.getAll('timeSlots-start') as string[];
        const times_end = formData.getAll('timeSlots-end') as string[];
        const referringDate = formData.get('referring-date') as string;


        return props.onSubmit({
            start: start as string, end: end as string, timeSlots: times_start.map((m, index) => [
                m,
                times_end[index]
            ]), referringDate
        });

    }}>
        <div className="flex gap-3">
            <label className="label" htmlFor='start'><span className="label-text">Start date:</span></label>
            <input className="input " id='start' name="start" type='date'></input>

            <label className="label" htmlFor='end'><span className="label-text">End date:</span></label>
            <input className="input " id="end" name="end" type='date'></input>
        </div>
        <div>
            <div className="divider"></div>

            <div className="py-5">
                <button className="btn btn-outline" type='button' onClick={() => setTimeSlots(timeSlots + 1)}>Add time slot</button>
            </div>


            {timeSlots > 0 && <div className="py-5">
                <label className="label" htmlFor='referring-date'><span className="label-text">Referring date:</span></label>
                <input className="input " id="referring-date" type="date" name="referring-date" />
            </div>}


            {Array.from({ length: timeSlots }, (_, i) => i + 1).map((i, index) => <div key={i}>
                
                <div className="text-error">
                    {props.errorFields && props.errorFields[index] ? Object.entries(props.errorFields[index]).map(([key, value]) => value && <div key={key}>Conflitto con l'intervallo {Number(key) + 1}</div>) : null}
                </div>
                <div className="flex gap-3">
                    <div className="w-full">
                        <label className="label" htmlFor={`timeSlots-${i}`}><span className="label-text">Time slots start: {i}</span></label>
                        <input className="input w-full" id={`timeSlots-${i}`} name="timeSlots-start" type='time'></input>
                    </div>
                    <div className="w-full">
                        <label className="label" htmlFor={`timeSlots-${i}`}><span className="label-text">Time slots end: {i}</span></label>
                        <input className="input w-full" id={`timeSlots-${i}`} name="timeSlots-end" type='time'></input>
                    </div>
                </div>
            </div>)}

        </div>
        <button className="btn btn-primary mt-5" type='submit'>Submit</button>
    </form>
}