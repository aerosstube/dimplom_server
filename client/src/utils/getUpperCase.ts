export const getUpperCase = (value: string) => {
    const res = value?.split('')?.map((letter, index: number) => {
        letter.toUpperCase()
    })
    return res?.join('')
}