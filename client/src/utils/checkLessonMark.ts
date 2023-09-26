import cl from '../components/LessonPage/LessonPage.module.css'

export function checkLessonMark(mark: string) {
    switch (mark.toLowerCase()) {
        case '5':
            return cl.exMark;

        case '4':
            return cl.goodMark;

        case '3':
            return cl.midMark;

        case '2':
            return cl.badMark;

        case 'н':
            return cl.badMark

        case 'о':
            return cl.late;

        case 'б':
            return cl.sick;

        case 'п':
            return cl.sick

        default:
            return cl.default;
    }
}