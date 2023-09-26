export interface findDateParams {

    start_time: string;
}

export function findDate(dates: findDateParams[], indexDate: number) {
    let date = '';
    for (let i = 0; i < dates.length; i++) {
        if (i === indexDate) {
            date = dates[i].start_time
        }
    }
    return date
}