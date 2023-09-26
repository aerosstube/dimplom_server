export interface IMisses {
    missesOptions:
        {
            classId: number,
            name: string,
            marks:
                {
                    id: number,
                    student_id: number,
                    mark: string,
                    two_our_class_id: number,
                    date: string
                }[],
            pSum: number,
            nSum: number,
            bSum: number
        }[],
    amountMisses: {
        pSum: number,
        bSum: number,
        nSum: number
    }
}