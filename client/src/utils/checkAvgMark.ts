import cl from '../components/TableCell/TCell.module.css'

export const checkAvgMark = (value: string) => {

    if (Number(value) >= 4.5) {
        return cl.exAvgMark
    }
    if (Number(value) >= 3.5 && Number(value) < 4.5) {
        return cl.goodAvgMark
    }
    if (Number(value) >= 2.5 && Number(value) < 3.5) {
        return cl.midAvgMark
    }
    if (Number(value) < 2.5 && Number(value) > 0) {
        return cl.badAvgMark
    }

    return cl.default

}