import dayjs from 'dayjs'; //? Dimensione
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { LanguageSelect } from './LanguageSelect';
import { RangeForm, useErrorFields } from './Form';
import { Wrapper } from './Wrapper';
import { Today } from './Today';


dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const DayJs = () => {
    const [difference, setDifference] = React.useState<string | number>("");
    const [error, setError] = useErrorFields({})
    const [locale, setLocale] = React.useState<string>('en');
    const date = dayjs().locale(locale);

    return (
        <Wrapper title='Day JS'>
            <LanguageSelect onChange={setLocale} />
            <Today
                today={date.format('dddd, MMMM D, YYYY')}
                time={date.format('h:mm:ss A')}
                unix={date.unix()}>

                <strong>{difference}</strong>
            </Today>

            <RangeForm errorFields={error} onSubmit={({ end, start, referringDate, timeSlots }) => {
                const startDay = dayjs(start);
                const endDay = dayjs(end);

                if (!startDay.isValid()) {
                    return setDifference('Start date is invalid');
                }

                if (!endDay.isValid()) {
                    return setDifference('End date is invalid');
                };

                if (startDay.isAfter(endDay)) {
                    return setDifference('Start date must be before end date');
                };

                const diff = endDay.diff(startDay, 'day');

                setDifference(`There are ${dayjs.duration(diff, "weeks").humanize()} days between the two dates.`);

                const referringDateDay = dayjs(referringDate);
                if (referringDateDay.isValid()) {
                    if (timeSlots.length > 0) {
                        const dates = timeSlots.map(([left, right], index) => {
                            const leftDate = dayjs(`${referringDate} ${left}`);
                            const rightDate = dayjs(`${referringDate} ${right}`);

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
                                // ? https://day.js.org/docs/en/plugin/is-between#docsNav
                                const f = left.isBetween(left2, right2, null, '[]')
                                    || right.isBetween(left2, right2, null, '[]')
                                    || left2.isBetween(left, right, null, '[]')
                                    || right2.isBetween(left, right, null, '[]');
                                errors[current][index2] = f;

                                return f;
                            }, false);


                            current++;
                        }

                        setError(errors);
                    }

                }
            }
            } />
        </Wrapper >
    )
}

