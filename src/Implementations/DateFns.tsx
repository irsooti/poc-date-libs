import React from 'react'
import { Wrapper } from '../Wrapper';
import { LanguageSelect } from '../LanguageSelect';
import * as dfns from 'date-fns'
import { es, it, enUS } from 'date-fns/locale'
import { RangeForm, useErrorFields } from '../Form';
import { Today } from '../Today';

const locales = {
    en: enUS,
    it,
    es,
}

export const DateFns = () => {
    const [difference, setDifference] = React.useState<string | number>("");
    const [locale, setLocale] = React.useState<string>('en');
    const [errorFields, setErrors] = useErrorFields({});

    dfns.setDefaultOptions({ locale: locales[locale as keyof typeof locales] })
    const date = new Date();


    return (
        <Wrapper title='Date FNS'>
            <LanguageSelect onChange={setLocale} />
            <Today today={dfns.format(date, 'cccc, LLLL d, y')} time={dfns.format(date, 'h:mm:ss a')} unix={dfns.getUnixTime(date)}>

                <strong>{difference}</strong>
            </Today>

            <RangeForm errorFields={errorFields} onSubmit={({ end, start, timeSlots, referringDate }) => {
                const startDay = dfns.parseISO(start);
                const endDay = dfns.parseISO(end);

                if (!dfns.isValid(startDay)) {
                    return setDifference('Start date is invalid');
                }

                if (!dfns.isValid(endDay)) {
                    return setDifference('End date is invalid');
                };

                if (startDay > endDay) {
                    return setDifference('Start date must be before end date');
                };

                const diff = dfns.differenceInDays(endDay, startDay);

                setDifference(`There are ${dfns.formatDistance(diff, 0)} between the two dates.`);


                // ? https://date-fns.org/v2.29.3/docs/areIntervalsOverlapping
                const referringDateDay = dfns.parseISO(referringDate);
                if (dfns.isValid(referringDateDay)) {
                    if (timeSlots.length > 0) {
                        const dates = timeSlots.map(([left, right], index) => {
                            const leftDate = dfns.parseISO(`${referringDate} ${left}`);
                            const rightDate = dfns.parseISO(`${referringDate} ${right}`);

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
                                const f = dfns.areIntervalsOverlapping({ start: left2, end: right2 }, { start: left, end: right }, { inclusive: true });
                                errors[current][index2] = f;

                                return f;
                            });


                            current++;
                        }

                        setErrors(errors);
                    }
                }

            }} />
        </Wrapper>
    )
}
