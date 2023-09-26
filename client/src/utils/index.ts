export function getMonday(d: any) {
    d = new Date(d);
    let day = d.getDay();
    let diff = d.getDate() - day + (day == 0 ? -6 : 1);

    let res = new Date(d.setDate(diff));
    res.setHours(0);
    res.setMinutes(0);
    res.setSeconds(0);
    res.setMilliseconds(0);
    return res

}