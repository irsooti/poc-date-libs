import * as luxon from 'luxon';
import React from 'react';
import { LanguageSelect } from '../LanguageSelect';
import { RangeForm, useErrorFields } from '../Form';
import { Wrapper } from '../Wrapper';
import { Today } from '../Today';

// ? accetta date SQL
// ? accetta calendari diversi  .reconfigure({ outputCalendar: "hebrew" })

export const Luxon = () => {
    const [difference, setDifference] = React.useState<string | number>("");
    const [locale, setLocale] = React.useState<string>('en');
    const [error, setError] = useErrorFields({});
    luxon.Settings.defaultLocale = locale;

    const date = luxon.DateTime.now();

    return (
        <Wrapper title='Luxon'>
            <LanguageSelect onChange={setLocale} />
            <Today
                today={date.toFormat('cccc, LLLL d, y')}
                time={date.toFormat('h:mm:ss a')}
                unix={date.toUnixInteger()}>

                <strong>{difference}</strong>
            </Today>
            <RangeForm errorFields={error} onSubmit={({ end, start, referringDate, timeSlots }) => {
                const startDay = luxon.DateTime.fromFormat(start, 'yyyy-MM-dd');
                const endDay = luxon.DateTime.fromFormat(end, 'yyyy-MM-dd');

                if (!startDay.isValid) {
                    return setDifference('Start date is invalid');
                }

                if (!endDay.isValid) {
                    return setDifference('End date is invalid');
                };

                if (startDay > endDay) {
                    return setDifference('Start date must be before end date');
                };

                const diff = endDay.diff(startDay, 'day');

                setDifference(`There are ${diff.toHuman()} between the two dates.`);


                const referringDateDay = luxon.DateTime.fromISO(referringDate);
                if (referringDateDay.isValid) {
                    if (timeSlots.length > 0) {
                        const dates = timeSlots.map(([left, right], index) => {
                            const leftDate = luxon.DateTime.fromFormat(`${referringDate} ${left}`, 'yyyy-MM-dd HH:mm');
                            const rightDate = luxon.DateTime.fromFormat(`${referringDate} ${right}`, 'yyyy-MM-dd HH:mm');

                            return [leftDate, rightDate, index] as const
                        });

                        let count = dates.length;
                        let current = 0;
                        let errors: {
                            [key: number]: {
                                [key: number]: boolean
                            }
                        } = {};

                        while (current < count) {
                            errors[current] = {};
                            const [left, right, index] = dates[current];
                            const sliced = dates.filter(([_, __, index2]) => index2 !== index);


                            sliced.forEach(([left2, right2, index2]) => {
                                // are intervals overlapping
                                const f = luxon.Interval.fromDateTimes(left, right).overlaps(luxon.Interval.fromDateTimes(left2, right2));
                                errors[current][index2] = f;

                                return f;
                            });


                            current++;
                        }

                        setError(errors);
                    }
                }
            }} />

        </Wrapper>
    )
}

