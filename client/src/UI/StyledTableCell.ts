import {styled, TableCell, tableCellClasses, TableRow} from '@mui/material';

export const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.black,
        backgroundColor: 'rgba(66,215,243,0.7)',
        border: '2px #1E8BFD solid',
        textAlign: 'center',
        width: 'auto',
        fontWeight: 'bold',
        fontSize: 'large'

    },
    [`&.${tableCellClasses.body}`]: {

        paddingLeft: '0',
        paddingRight: '0',
        textAlign: 'center',
        backgroundColor: 'rgba(66,215,243,0.2)',
        borderTop: '0 solid #42D7F3',
        borderLeft: '1px solid #1E8BFD',
        borderRight: '1px solid #1E8BFD',
        borderBottom: '1px solid #1E8BFD',
        fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}:nth-child(2n+1)`]: {
        fontSize: 14,
        paddingLeft: '0',
        paddingRight: '0',
        textAlign: 'center',
        backgroundColor: 'rgba(66,215,243,0.4)',
        borderTop: '0 solid #42D7F3',
        borderLeft: '1px solid #1E8BFD',
        borderRight: '1px solid #1E8BFD',
        borderBottom: '1px solid #1E8BFD'


    },
    [`&.${tableCellClasses.body}:nth-child(1)`]: {
        fontSize: 16,
        paddingLeft: '0',
        paddingRight: '0',
        textAlign: 'center',
        backgroundColor: 'rgba(66,215,243,0.6)',
        border: '2px #1E8BFD solid',


    },
}));
export const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
